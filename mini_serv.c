/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mini_serv.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: vpolojie <vpolojie@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/09/16 15:36:56 by vpolojie          #+#    #+#             */
/*   Updated: 2024/09/16 16:11:32 by vpolojie         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>

typedef struct s_client{
    int id;
    char msg[1000000];
}t_client;

t_client clients[1024];
int max_fd = 0;
int gid = 0;
fd_set read_set, write_set, current;
char send_buffer[1000022], read_buffer[1000022];

void    ft_error(char *content)
{
    if (content)
        write(2, content, strlen(content));
    else
        write(2, "fatal error", 11);
    write(2, "\n", 1);
    exit(1);
}

void    send_to_all(int expediteur)
{
    for (int i = 0; i != max_fd; i++)
    {
        if (FD_ISSET(i, &write_set) && i != expediteur)
        {
            if (send(i, send_buffer, strlen(send_buffer), 0) == -1)
                ft_error(NULL);
        }
    }
}

int main(int argc, char **argv)
{
    if (argc != 2)
        ft_error("Incorrect number of arguments");
    int server_fd;
    struct sockaddr_in serv_addr;
    socklen_t len;
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1)
        ft_error(NULL);
    else
        max_fd = server_fd;
    FD_ZERO(&current);
    FD_SET(server_fd, &current);
    bzero(clients, sizeof(clients));
    bzero(&serv_addr, sizeof(serv_addr));

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(2130706433);
    serv_addr.sin_port = htons(atoi(argv[1]));

    if (bind(server_fd, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) == -1)
        ft_error(NULL);
    if (listen(server_fd, 100) == -1);
        ft_error(NULL);

    while (1)
    {
        read_set = write_set = current;
        if (select(max_fd + 1, &read_set, &write_set, 0, 0) == -1) continue;

        for (int fd = 0; fd <= max_fd; fd++)
        {
            if (FD_ISSET(fd, &current))
            {
                // soit connexion entrante
                if (fd == server_fd)
                {
                    int client_fd = accept(fd, (struct sockaddr *)&serv_addr, len);
                    if (client_fd == -1) continue;
                    else if (client_fd > max_fd) max_fd = client_fd;
                    clients[client_fd].id = gid++;
                    FD_SET(client_fd, &current);
                    sprintf(send_buffer, "client: %d just arrived\n", clients[client_fd].id);
                    send_to_all(client_fd);
                }
                else
                {
                    int resultat_message = recv(fd, read_buffer, strlen(read_buffer), 0);
                    if (resultat_message <= 0)
                    {
                        // soit deco
                        sprintf(send_buffer, "server: client %d disconected\n", clients[fd].id);
                        send_to_all(fd);
                        FD_CLR(fd, &current);
                        close(fd);
                        bzero(clients[fd].msg, sizeof(clients[fd].msg));
                    }
                    else
                    {
                        // soit message a tout le mode
                        for (int i = 0, j = strlen(clients[fd].msg); i < resultat_message; i++, j++)
                        {
                            clients[fd].msg[j] = read_buffer[i];
                            if (clients[fd].msg[j] == '\n')
                            {
                                clients[fd].msg[j] = '\0';
                                sprintf(send_buffer, "client %d: %s\n", clients[fd].id, clients[fd].msg);
                                send_to_all(fd);
                                bzero(clients[fd].msg, sizeof(clients[fd].msg));
                                j = -1;
                            }
                        } 
                    }
                }
                break ;
            }
        }
    }
    return (0);
}