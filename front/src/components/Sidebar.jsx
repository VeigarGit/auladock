import styles from './Sidebar.module.css';
import { PencilLine } from 'phosphor-react';
import Avatar from "./Avatar";

export function Sidebar({ onCreateTask }) {
  return (
    <aside className={styles.sidebar}>
      <img
        className={styles.cover}
        src="https://images.unsplash.com/photo-1674123784422-b91aa402aa74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8&w=300&q=50"
        alt="Imagem de capa"
      />
      <div className={styles.profile}>
        <Avatar src="https://i.pravatar.cc/150?img=32" />
        <strong>Nilse Becker</strong>
        <span>Web Developer</span>
      </div>

      <footer>
        <button type="button" onClick={onCreateTask}>
          <PencilLine size={20} />
          Nova tarefa
        </button>
      </footer>
    </aside>
  );
}
