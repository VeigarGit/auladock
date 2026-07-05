import styles from "./Post.module.css";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { PencilSimple, Trash } from "phosphor-react";

export function Post({ tarefa, onEdit, onDelete }) {
  const createdAt = tarefa.creatAtt ? new Date(tarefa.creatAtt) : new Date();
  const publishedDateFormatted = format(createdAt, "d 'de' LLLL 'às' HH:mm", {
    locale: ptBR,
  });
  const publishedDateOnly = format(createdAt, "dd/MM/yyyy", {
    locale: ptBR,
  });

  const statusLabel = tarefa.status ? "Concluída" : "Pendente";

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <div className={styles.authorInfo}>
            <strong>{tarefa.titulo}</strong>
            <span>{statusLabel}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <time title={publishedDateFormatted} dateTime={createdAt.toISOString()}>
            {publishedDateOnly}
          </time>
          <button type="button" className={styles.actionButton} onClick={onEdit} aria-label="Editar tarefa">
            <PencilSimple size={18} />
          </button>
          <button type="button" className={styles.actionButton} onClick={onDelete} aria-label="Excluir tarefa">
            <Trash size={18} />
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <p>{tarefa.descricao}</p>
        <p>
          <strong>Status:</strong> {statusLabel}
        </p>
      </div>
    </article>
  );
}
