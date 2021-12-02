import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/client";

import { useData } from "state/data-context";
import { useChannel } from "./AblyReactEffect";
import { VotePoster } from "components/poster";
import styles from "./Vote.module.scss";

type VoteProps = {
  creator: boolean;
};

export default function Vote({ creator }: VoteProps) {
  const { listId } = useData();
  const [session, loading] = useSession();
  const [movies, setMovies] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [voteActive, setVoteActive] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteFinished, setVoteFinished] = useState(false);
  const [channel, ably] = useChannel("votes", (message) => {
    if (message.name === "update") {
      setMovies(message.data);
      localStorage.setItem("voteMovies", JSON.stringify({ movies: message.data }));
    }

    if (message.name === "start") {
      setMovies(message.data.movies);
      setCurrentTime(Math.round((message.data.vote_end - Date.now()) / 1000));
      setHasVoted(false);
      localStorage.setItem("hasVoted", "false");
      setVoteActive(true);
      localStorage.setItem("voteActive", "true");
    }
  });

  useEffect(() => {
    //Check if there is an active vote
    fetch(`/api/vote/${listId}`)
      .then((response) => response.json())
      .then((data) => {
        //If there is an active vote, get payload
        if (data.active) {
          setMovies(data.movies);
          setCurrentTime(Math.round((data.vote_end - Date.now()) / 1000));
          setVoteActive(true);
          setHasVoted(data.hasVoted);
          localStorage.setItem("voteMovies", JSON.stringify({ movies: data.movies }));
          localStorage.setItem("voteActive", "true");
        } else {
          //No active vote
          //clear previous movies from localstorage
          localStorage.setItem("voteActive", "false");
        }
      });

    const finishedVote = localStorage.getItem("voteFinished");
    if (finishedVote) setVoteFinished(finishedVote === "true" ? true : false);

    const storedMovies = JSON.parse(localStorage.getItem("voteMovies"));
    if (storedMovies) setMovies(storedMovies.movies);
  }, []);

  useEffect(() => {
    let interval;
    if (currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(currentTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  });

  useEffect(() => {
    //End of vote
    if (currentTime === 0) {
      if (voteActive) {
        setVoteFinished(true);
        localStorage.setItem("voteFinished", "true");
      }
      setVoteActive(false);
    }
  }, [currentTime]);

  const startVote = () => {
    //Check if selected time is positive and a max of 10 minutes
    if (selectedTime < 1 || selectedTime > 10) {
      toast.error("Vote time must be between 1 to 10 minutes");
      return;
    }

    //Check if there is at least 2 movies to vote on
    if (movies.length < 2) {
      toast.error("At least 2 movies need to be selected");
      return;
    }

    const endTime = Date.now() + selectedTime * 60 * 1000;

    fetch(`/api/vote/${listId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endTime,
        movies,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //setCurrentTime(Math.round((data.vote_end - Date.now()) / 1000));
        console.log(data);
      });
  };

  const submitVote = (imdbID) => {
    if (session) {
      fetch(`/api/vote/${listId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imdbID }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") setHasVoted(true);
        });
    } else {
      toast.error("Please sign in to vote");
    }
  };

  const removeFromVote = (imdbID) => {
    const localMovies = localStorage.getItem("voteMovies");
    if (localMovies) {
      const movies = JSON.parse(localStorage.getItem("voteMovies")).movies;
      const filtered = movies.filter((m) => m.imdbID !== imdbID);
      localStorage.setItem("voteMovies", JSON.stringify({ movies: filtered }));
      setMovies(filtered);
    }
  };

  const clearMovies = () => {
    if (!creator) return;
    setMovies([]);
    localStorage.setItem("voteMovies", JSON.stringify({ movies: [] }));
    setVoteFinished(false);
    localStorage.setItem("voteFinished", "false");
    setHasVoted(false);
    localStorage.setItem("hasVoted", "false");
  };

  const clock = (time: number) => {
    if (time <= 0) return "00:00";
    let minutes = Math.floor(time / 60);
    let seconds: string | number = time % 60;
    if (seconds < 10) seconds = `0${seconds.toString()}`;
    return `${minutes}:${seconds}`;
  };

  const NoActiveVote = () => {
    return (
      <div id={styles.noActiveVoteContainer}>
        <h2>NO ACTIVE VOTE</h2>
      </div>
    );
  };

  const VoteTools = () => {
    if (creator) {
      return (
        <div id={styles.voteTools}>
          {!voteFinished && (
            <>
              <input
                id={styles.timeInput}
                type="number"
                step="1"
                min="0"
                max="10"
                value={selectedTime}
                onChange={(e) => {
                  e.target.value === ""
                    ? setSelectedTime(1)
                    : setSelectedTime(parseInt(e.target.value));
                }}
              />
              <p>minutes</p>
              <button onClick={startVote}>Start</button>
            </>
          )}

          {creator && voteFinished ? (
            <button id={styles.clear} onClick={clearMovies}>
              Clear
            </button>
          ) : null}
        </div>
      );
    }
    return null;
  };

  return (
    <div id={styles.container}>
      {!voteActive ? <NoActiveVote /> : null}
      {voteFinished && <div id={styles.previous}>Previous Vote</div>}
      <div id={styles.info}>
        {!voteActive ? <VoteTools /> : null}
        {voteActive && <div id={styles.clock}>Remaining Time {clock(currentTime)}</div>}
      </div>

      <div id={styles.gallery}>
        <div id={styles.movies}>
          {movies.map((movie) => (
            <VotePoster
              key={movie.title}
              movie={movie}
              creator={creator}
              voteActive={voteActive}
              hasVoted={hasVoted}
              voteFinished={voteFinished}
              removeFromVote={removeFromVote}
              submitVote={submitVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
