/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serv_vlad.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: vpolojie <vpolojie@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/27 08:04:57 by vpolojie          #+#    #+#             */
/*   Updated: 2024/09/27 08:55:54 by vpolojie         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>

typedef struct s_client {
    int id;
    char *msg_buffer;
    size_t msg_buffer_len;
    size_t msg_buffer_content_size;
}t_client;

void    ft_error(char *content)
{
    if (content)
        write(2, content, strlen(content));
    else
        write(2, "fatal error", 11);
    write(2, "\n", 1);
    exit(1);
}

void ft_append_buffer(t_client *client, char *buffer, size_t size_buffer)
{
    if (client->msg_buffer_len < client->msg_buffer_len + size_buffer + 1)
    {
        size_t new_size = client->msg_buffer_len + size_buffer + 1;
        char *new_buf;
        new_buf = malloc(sizeof(char) * new_size);
        if (!new_buf)
            ft_error(NULL);
        if (client->msg_buffer)
        {
            strcpy(new_buf, client->msg_buffer);
            free(client->msg_buffer);
        }
        else
        {
            new_buf[0] = '\0';
        }
        client->msg_buffer = new_buf;
        client->msg_buffer_len = new_size;
    }
    strcat(client->msg_buffer, buffer);
    client->msg_buffer_content_size = client->msg_buffer_content_size + size_buffer;
}

void send_buffer(t_client *clients, char *buffer, int expediteur)
{
    fd_set write_fds;
    size_t buffer_size = strlen(buffer);
    int nfds = 0;
    FD_ZERO(&write_fds);
    for (int fd = 0; fd < 1024; fd++)
    {
        if (fd != expediteur && clients[fd].id >= 0)
        {
            if (fd >= nfds)
                nfds = fd + 1;
            FD_SET(fd, &write_fds);
        }
    }
    
    if (nfds = 0)
        return ;

    struct timeval timeout = {0, 0};
    select(nfds, NULL, &write_fds, NULL, &timeout);

    for (int fd = 0; fd <= nfds; fd++)
    {
        if (FD_ISSET(fd, &write_fds))
            send(fd, buffer, buffer_size, 0);
    }
}

void broadcast_client_message(t_client *clients, t_client *sender, int fd) {
    char *tmp_msg = malloc(256+strlen(sender->msg_buffer));

    sprintf(tmp_msg, "client %d: %s\n", sender->id, sender->msg_buffer);

    broadcast_message(clients, fd, tmp_msg);

    free(tmp_msg);
}

int main(int argc, char **argv)
{
    if (argc != 2)
    {
        write(2, "Wrong number of arguments\n", 27);
        exit(1);
    }
    int server_fd;
    struct sockaddr_in serv_addr;
    socklen_t len;
    t_client clients[1024];
    fd_set read_fds;
    int current_id = 0;
    for (size_t i = 0; i < 1024; i++) clients[i].id = -1;
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1)
        ft_error(NULL);
    memset(&serv_addr, 0, sizeof(serv_addr));

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(2130706433);
    serv_addr.sin_port = htons(atoi(argv[1]));

    if (bind(server_fd, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) == -1)
        ft_error(NULL);
    if (listen(server_fd, 100) == -1);
        ft_error(NULL);
    
    while (1)
    {
        FD_ZERO(&read_fds);
        int nfds = server_fd + 1;
        FD_SET(server_fd, &read_fds);
        for (int fd = 0; fd < 1024; fd++)
        {
            if (clients[fd].id >= 0)
            {
                if (fd > nfds)
                    nfds = fd + 1;
                FD_SET(fd, &read_fds);
            }
        }
        
        select(nfds, &read_fds, NULL, NULL, NULL);

        for (int fd = 0; fd < nfds; fd++)
        {
            if (!FD_ISSET(fd, &read_fds))
                continue ;
            if (fd == server_fd)
            {
                int new_fd = accept(fd, (struct sockaddr *)&serv_addr, &len);
                clients[new_fd].id = current_id;
                current_id++;
                char buffer[256];
                sprintf(buffer, "new client has arrived : %d\n", clients[new_fd].id);
                send_buffer(clients, buffer, new_fd);
            }
            else
            {
                char recv_buffer[10001];
                int recv_len = recv(fd, recv_buffer, sizeof(recv_buffer) - 1, 0);
                if (recv_len <= 0)
                {
                    close(fd);
                    char msg_buffer[256];
                    sprintf(msg_buffer, "client %d has left\n", clients[fd].id);
                    send_buffer(clients, msg_buffer, -1);
                    if (clients[fd].msg_buffer)
                        free(clients[fd].msg_buffer);
                }
                else
                {
                    recv_buffer[recv_len] = 0;
                    char *nl = NULL;
                    char *start = recv_buffer;
                    char *end = recv_buffer;

                    while ((end = strstr(start, "\n")) != NULL)
                    {
                        *end = '\0';
                        ft_append_buffer(&clients[fd], start, end - start + 1);
                        broadcast_client_message(clients, &clients[fd], fd);
                        start = end + 1;
                    }

                    if (*start != '\0')
                    {
                        ft_append_buffer(&clients[fd], start, strlen(start));
                    }
                }
            }
        }
    }
}