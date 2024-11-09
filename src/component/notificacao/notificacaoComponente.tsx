import React, { useEffect, useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { parse, format, differenceInCalendarDays } from 'date-fns';
import BuscarProjetosEmAndamentoService from '../../services/notificacao/buscarProjetosNotificacao';
import styles from './notificacao.module.css';

type Notification = {
  id: number;
  message: string;
  date: string;
  read: boolean;
  projetoId: number;
  titulo: string;
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await BuscarProjetosEmAndamentoService();
      if (response.status === 200) {
        const projetos = response.data;
        const newNotifications = projetos.map((projeto: any) => {
          const dataTermino = parse(projeto.dataTermino, 'yyyy-MM-dd', new Date());
          const diasAtraso = differenceInCalendarDays(new Date(), dataTermino);
          const diasRestantes = differenceInCalendarDays(dataTermino, new Date());
          let message = '';

          if (diasAtraso > 0) {
            message = `está atrasado há ${diasAtraso} dias.`;
          } else if (diasRestantes <= 7) {
            message = `está em andamento e falta ${diasRestantes} dias para a data final.`;
          } else {
            // Se o projeto não está atrasado e falta mais de uma semana, não cria uma notificação
            return null;
          }

          return {
            id: projeto.id,
            message,
            date: format(dataTermino, 'dd/MM/yyyy'),
            read: false,
            projetoId: projeto.id,
            titulo: projeto.titulo,
          };
        }).filter((notification: null) => notification !== null); // Filtra notificações nulas
        setNotifications(newNotifications);
        const unread: number = newNotifications.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const togglePopover = () => setShowPopover(!showPopover);

  const handleNotificationClick = (projetoId: number) => {
    navigate(`/projeto/visualizar/${projetoId}`);
  };

  return (
    <div>
      <Button variant="link" onClick={togglePopover} className="notification-button">
        <div ref={bellRef} className={styles.notificationContainer}>
          <FaBell className={styles.bellIcon} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div>
      </Button>

      <Overlay target={bellRef.current} show={showPopover} placement="bottom">
        <Popover className={styles.customPopover}>
          <Popover.Header as="h3">Notificações</Popover.Header>
          <Popover.Body>
            {notifications.length === 0 ? (
              <p>Você não tem notificações.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.notificationUnread : ""}`}
                  onClick={() => handleNotificationClick(notification.projetoId)}
                >
                  <p className={styles.notificationMessage}>
                    <span className={styles.notificationTitle}>{`O projeto ${notification.titulo}`}</span> {notification.message}
                  </p>
                  <p className={styles.notificationDate}>{notification.date}</p>
                </div>
              ))
            )}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
};

export default Notifications;