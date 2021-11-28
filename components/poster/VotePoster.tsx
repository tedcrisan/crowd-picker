import styles from "./VotePoster.module.scss";

type VotePosterProps = {
  movie: any;
  creator: boolean;
  voteActive: boolean;
  hasVoted: boolean;
  voteFinished: boolean;
  removeFromVote: (x: string) => void;
  submitVote: (x: string) => void;
};

export function VotePoster({
  movie,
  creator,
  voteActive,
  hasVoted,
  voteFinished,
  removeFromVote,
  submitVote,
}: VotePosterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <p>{movie.title}</p>
        {voteActive && !hasVoted ? (
          <button className={styles.vote} onClick={() => submitVote(movie.imdbID)}>
            Vote
          </button>
        ) : null}
        {creator && !voteActive && !voteFinished ? (
          <button className={styles.remove} onClick={() => removeFromVote(movie.imdbID)}>
            Remove
          </button>
        ) : null}
      </div>
      <img src={movie.image} />
      <span className={styles.voteTotal}>{movie.voteTotal}</span>
    </div>
  );
}
