import { getSession } from "next-auth/client";
import Ably from "ably/promises";
import { Pool } from "pg";
import { VotePoster } from "components/poster";

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

export default async (req, res) => {
  const session = await getSession({ req });
  const { method, query } = req;
  const listID = query.slug[0];
  const currentTime = Date.now();

  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const channelVote = client.channels.get("votes");
  const channelSidebar = client.channels.get("sidebar");

  switch (method) {
    case "GET":
      //Get list of movies to vote on
      const getQuery = `SELECT movies, vote_end FROM votes WHERE votes.list_id = $1 AND vote_end > $2;`;
      const getResponse = await pool.query(getQuery, [listID, currentTime]);

      if (getResponse.rows[0]?.movies.movies) {
        //Active vote found
        const movies = getResponse.rows[0].movies.movies;
        const moviesWithVoteTotals = movies.map((m) => ({
          image: m.image,
          imdbID: m.imdbID,
          title: m.title,
          voteTotal: m.votes.length,
          year: m.year,
        }));

        //Determine if user voted
        let allVotes = [];

        for (const movie of movies) {
          //Create list of all voters
          if (movie?.votes) allVotes = [...allVotes, ...movie.votes];
        }
        //Check if user has voted
        let hasVoted = false;
        if (session) hasVoted = allVotes.find((user) => user === session.user.email);

        res.status(200).json({
          active: true,
          movies: moviesWithVoteTotals,
          hasVoted,
          vote_end: parseInt(getResponse.rows[0].vote_end),
        });
      } else {
        //No active found
        res.status(200).json({ active: false });
      }

      break;
    case "POST":
      const { endTime, movies } = req.body;
      //Check if there is an active vote, return error if true
      const alreadyRunningQuery = `SELECT id FROM votes WHERE votes.list_id = $1 AND vote_end > $2;`;
      const alreadyRunningResponse = await pool.query(alreadyRunningQuery, [listID, currentTime]);

      //No active vote for list
      if (!alreadyRunningResponse.rows[0]?.id) {
        //Add vote property to each movie
        const moviesWithVotes = movies.map((movie) => ({ ...movie, votes: [] }));

        //Push list of movies to database
        const postQuery = `INSERT INTO votes(list_id, movies, vote_end) VALUES ($1, $2, $3) 
          ON CONFLICT DO NOTHING RETURNING id, movies, vote_end;`;
        const postResponse = await pool.query(postQuery, [
          listID,
          { movies: moviesWithVotes },
          endTime,
        ]);

        //Send notification to sidebar and data to vote component
        if (postResponse.rows[0]?.id) {
          await channelSidebar.publish({ name: "category", data: "vote" });
          await channelVote.publish({
            name: "start",
            data: {
              movies,
              vote_end: parseInt(postResponse.rows[0].vote_end),
            },
          });

          //Success response
          res.status(200).json({ message: "Vote started successfully" });
        } else {
          res.status(404).json({ message: "Error starting vote" });
        }
      } else {
        //Active vote
        res.status(404).json({ message: "A vote is currently active." });
      }
      break;
    case "PATCH":
      const { imdbID } = req.body;

      //Check if there is an active vote, return error if there isn't
      const getRunningQuery = `SELECT id, movies FROM votes WHERE votes.list_id = $1 AND vote_end > $2;`;
      const getRunningResponse = await pool.query(getRunningQuery, [listID, currentTime]);

      //Active vote
      if (Boolean(getRunningResponse.rows[0]?.id)) {
        let allVotes = [];
        const movies = getRunningResponse.rows[0]?.movies.movies;

        for (const movie of movies) {
          //Create list of all voters
          if (movie?.votes) allVotes = [...allVotes, ...movie.votes];
        }
        //Check if user has voted
        if (allVotes.find((user) => user === session.user.email)) {
          //User has voted,send back error
          res.status(404).json({ status: "error", message: "User already voted" });
        } else {
          //New voter, add vote to selected movie, total votes
          const modifiedMovies = movies.map((m) => {
            const { image, title, votes, voteTotal, year } = m;

            if (m.imdbID === imdbID) {
              return {
                image,
                imdbID: m.imdbID,
                title,
                votes: [...votes, session.user.email],
                voteTotal: voteTotal + 1,
                year,
              };
            } else {
              return { image, imdbID: m.imdbID, title, votes, voteTotal, year };
            }
          });

          const patchQuery = `UPDATE votes SET movies = $1 WHERE id = $2 RETURNING id;`;
          const patchResponse = await pool.query(patchQuery, [
            { movies: modifiedMovies },
            getRunningResponse.rows[0].id,
          ]);
          //Vote was successful
          if (patchResponse.rows[0].id) {
            //Loop through filteredMovies, tally up total vote for each movie
            const finalizedMovies = modifiedMovies.map((m) => ({
              image: m.image,
              imdbID: m.imdbID,
              title: m.title,
              voteTotal: m.voteTotal,
              year: m.year,
            }));

            await channelVote.publish({
              name: "update",
              data: finalizedMovies,
            });
            res.status(200).json({ status: "success" });
          }
        }
      } else {
        //No active vote found
        res.status(404).json({ message: "No voting active" });
      }
      break;
    case "DELETE":
      //Delete list of movies
      const deleteQuery = `DELETE FROM votes WHERE id = $1`;
      const deleteResponse = await pool.query(deleteQuery, []);
      await channelVote.publish({ name: "list", data: { action: "delete" } });
      res.status(200).json({ action: "delete" });
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
