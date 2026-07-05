import { ThumbsUp, Trash } from "phosphor-react";
import { useState } from "react";
import Avatar from "./Avatar";
import styles from "./Comment.module.css";

export function Comment({ content, onDeleteComment }) {
  const [likeCount, setLikeCount] = useState(0);

  function handleLikeCount() {
    setLikeCount((state) => {
      return state + 1;
    });
    
  }

  function handleDeleteComment() {
    onDeleteComment(content);
  }
  return (
    <div className={styles.comment}>
      <Avatar hasBorder={false} src="https://i.pravatar.cc/150?img=12" />
      <div className={styles.commentBox}>
        <div className={styles.commentContent}>
          <header>
            <div className={styles.authorAndTime}>
              <strong>Nilse Becker</strong>
              <time title="11 de Maio ás 14:30" dateTime="2022-05-08 14:30:25">
                Cerca de 1h atrás{" "}
              </time>
            </div>
            <button onClick={handleDeleteComment} tittle="Deletar comentário">
              <Trash size={24} />
            </button>
          </header>
          <p> {content} </p>
        </div>
        <footer>
          <button onClick={handleLikeCount}>
            <ThumbsUp />
            Aplaudir
            <span>{likeCount}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
