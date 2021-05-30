import { getSession } from "next-auth/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

export default async (req, res) => {
  const session = await getSession({ req });
  const { method, query } = req;
  const listID = query.slug[0];
  const movieID = query.slug[1];

  switch (method) {
    case "GET":
      // Get list from database
      const getQuery = `
      SELECT
        creator, movie_id, movie_data AS data, watched, ARRAY_AGG(likes.email) AS likes
      FROM
        lists
        LEFT JOIN movies ON lists.list_id = movies.list_id
        LEFT JOIN likes ON movies.id = likes.id
      WHERE
        lists.list_id = $1
      GROUP BY
        creator, movie_id, movie_data, watched;
      `;
      pool
        .query(getQuery, [listID])
        .then((response) => {
          let watched = [];
          let unwatched = [];
          const formatData = () => {
            response.rows.forEach((movie) => {
              if (movie.watched) {
                watched = [
                  ...watched,
                  {
                    ...movie.data,
                    imdbID: movie.movie_id,
                    watched: true,
                    total_likes: movie.likes.includes(null) ? 0 : movie.likes.length,
                    user_liked: movie.likes.includes(session?.user.email) ?? false,
                  },
                ];
              } else {
                unwatched = [
                  ...unwatched,
                  {
                    ...movie.data,
                    imdbID: movie.movie_id,
                    watched: false,
                    total_likes: movie.likes.includes(null) ? 0 : movie.likes.length,
                    user_liked: movie.likes.includes(session?.user.email) ?? false,
                  },
                ];
              }
            });
          };

          formatData();

          const isListCreator = () => {
            if (session) {
              return session.user.email === response.rows[0].creator;
            }
            return false;
          };

          const formatedList = {
            creator: isListCreator(),
            watched,
            unwatched,
          };
          res.status(200).json({ payload: formatedList });
        })
        .catch((err) => {
          console.log(err);
          //res.sendStatus(400);
        });

      break;
    case "POST":
      const { imdbID, movie_data } = req.body;
      try {
        const insertMovieQuery = `
          INSERT INTO movies(list_id, movie_id, movie_data) 
          VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;
        `;
        const insertMovieResponse = await pool.query(insertMovieQuery, [
          listID,
          imdbID,
          movie_data,
        ]);

        res.json({
          payload: {
            imdbID,
            ...movie_data,
            total_likes: 0,
            user_liked: false,
          },
        });
      } catch (err) {
        console.log("POST", err);
      }
      break;
    case "PATCH":
      //Toggle likes to specific movie
      if (session && req.body.action === "like") {
        let payload;
        try {
          const getMovieIDQuery = `SELECT id FROM movies WHERE list_id = $1 AND movie_id = $2`;
          const getMovieIDResponse = await pool.query(getMovieIDQuery, [listID, movieID]);
          const checkForLikesQuery = `SELECT ARRAY_AGG(email) AS users FROM likes WHERE id = $1`;
          const checkForLikesResponse = await pool.query(checkForLikesQuery, [
            getMovieIDResponse.rows[0].id,
          ]);

          //If not null and contains user, delete like
          if (
            checkForLikesResponse.rows[0].users &&
            checkForLikesResponse.rows[0].users.includes(session.user.email)
          ) {
            //Like exists, so remove it
            const deleteLikeQuery = `DELETE FROM likes WHERE id = $1 AND email = $2;`;
            const deleteLikeResponse = await pool.query(deleteLikeQuery, [
              getMovieIDResponse.rows[0].id,
              session.user.email,
            ]);
            payload = {
              total_likes: checkForLikesResponse.rows[0].users.length - 1,
              user_liked: false,
            };
          } else {
            //Like does not exist, so add it
            const insertLikeQuery = `INSERT INTO likes(id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
            const insertLikeResponse = await pool.query(insertLikeQuery, [
              getMovieIDResponse.rows[0].id,
              session.user.email,
            ]);
            payload = {
              total_likes: checkForLikesResponse.rows[0].users
                ? checkForLikesResponse.rows[0].users.length + 1
                : 1,
              user_liked: true,
            };
          }

          res.json({ payload });
        } catch (err) {
          console.log(err);
        }
      }
      //This is to switch between watched and unwatched
      if (session && req.body.action === "switch") {
        try {
          const getWatchStatusQuery = `SELECT id, watched FROM movies WHERE list_id = $1 AND movie_id = $2`;
          const getWatchStatusResponse = await pool.query(getWatchStatusQuery, [listID, movieID]);

          const updateWatchedQuery = `UPDATE movies SET watched = $1 WHERE id = $2`;
          const updateWatchedResponse = await pool.query(updateWatchedQuery, [
            !getWatchStatusResponse.rows[0].watched,
            getWatchStatusResponse.rows[0].id,
          ]);

          res.status(200).json({ watched: !getWatchStatusResponse.rows[0].watched });
          break;
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: "PROBLEM" });
        }
      }
      break;
    case "DELETE":
      const deleteMovieQuery = `DELETE FROM movies WHERE list_id = $1 AND movie_id = $2;`;
      const deleteMovieResponse = await pool.query(deleteMovieQuery, [listID, movieID]);
      res.json({ id: movieID });
      break;
    default:
      //res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  //res.end();
};
