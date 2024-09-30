#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sys/select.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

#include <netinet/ip.h>

typedef struct {
    int     id;
    char    *buff;
    size_t  bufflen;
    size_t  buffcap;
} client_t;

static void client_buff_add(client_t *c, const char *buff, size_t bufflen) {
    if (c->buffcap < (c->bufflen + bufflen + 1)) {
        size_t new_cap = c->bufflen + bufflen + 1;
        char *new_buff = malloc(new_cap);
        if (new_buff == NULL) {
            // Handle allocation failure
            perror("malloc");
            exit(EXIT_FAILURE);
        }
        if (c->buff) {
            strcpy(new_buff, c->buff);
            free(c->buff);
        } else {
            new_buff[0] = '\0';
        }
        c->buff = new_buff;
        c->buffcap = new_cap;
    }
    strcat(c->buff, buff);
    c->bufflen = c->bufflen + bufflen;
}

void broadcast_message(client_t *clients, int ignore_fd, char *buff) {
    size_t bufflen = strlen(buff);
    fd_set writefds;
    int nfds = 0;
    FD_ZERO(&writefds);
    for (int i = 0; i < 1024; i++) {
        if (i != ignore_fd && clients[i].id >= 0) {
            if (nfds <= i)
                nfds = i + 1;
            FD_SET(i, &writefds);
        }
    }

    // si y'a qu'un seul client, on l'envoie à personne '-'
    if (nfds == 0)
        return;

    struct timeval timeout = {0,0};
    select(nfds, NULL, &writefds, NULL, &timeout);

    for (int i = 0; i < 1024; i++) {
        if (FD_ISSET(i, &writefds)) {
            // on va faire confiance au sujet même s'il est un peu nul à chier
            send(i, buff, bufflen, 0);
            // comment on peut s'assurer de ne pas envoyer le message a ignore_fd ? //
        }
    }
}

void broadcast_client_message(client_t *clients, client_t *sender, int fd) {
    char *tmp_msg = malloc(256+strlen(sender->buff));

    sprintf(tmp_msg, "client %d: %s\n", sender->id, sender->buff);

    broadcast_message(clients, fd, tmp_msg);

    free(tmp_msg);
}

int main(int argc, char * const *argv) {
    int serv_fd = 0;
    int listen_port = 0;
    int cur_id = 0;
    fd_set  readfds;

    client_t clients[1024];
    for (size_t i = 0; i < 1024; i++) clients[i].id = -1;
    struct sockaddr_in listen_addr;

    if (argc != 2) {
        write(2, "Wrong number of arguments\n", 26);
        exit(1);
    }
    
    memset(&listen_addr, 0, sizeof(listen_addr));
    listen_addr.sin_family  = AF_INET;
    /*  ils disent pas que le port peut être invalid dans l'argument */
    listen_addr.sin_port    = htons(atoi(argv[1])); // TODO: vérifier si on a le droit à htons
    listen_addr.sin_addr.s_addr  = 0x0100007F;

    if ((serv_fd = socket(AF_INET, SOCK_STREAM, 0)) < 0)
        exit((write(2, "Fatal error\n", 12), 1));

    if (bind(serv_fd, (void *)&listen_addr, (socklen_t)sizeof(listen_addr)) < 0)
        exit((write(2, "Fatal error\n", 12), 1));

    if (listen(serv_fd, 5) < 0)
        exit((write(2, "Fatal error\n", 12), 1));

    while (1) {
        /*  techniquement le man dit pas si on peut faire = sur différents fdset
            donc vaut mieux éviter */
        FD_ZERO(&readfds);
        int nfds = serv_fd + 1;
        FD_SET(serv_fd, &readfds);
        for (int i = 0; i < 1024; i++) {
            if (clients[i].id >= 0) {
                if (i >= nfds)
                    nfds = i + 1;
                FD_SET(i, &readfds);
            }
        }

        /* pas vraiment de raison que select fasse de la merde */
        select(nfds, &readfds, NULL, NULL, NULL);

        for (int i = 0; i < nfds; i++) {
            if (!FD_ISSET(i, &readfds))
                continue;

            if (i == serv_fd) {
                socklen_t l = 0;
                int new_fd = accept(serv_fd, (void *)0x6969, &l);
                clients[new_fd].id = cur_id;
                cur_id++;
                char msg_buff[255];
                sprintf(msg_buff, "server: client %d just arrived\n", clients[new_fd].id);
                broadcast_message(clients, new_fd, msg_buff);
            } else {
                char buff[10001]; 
                int ret = recv(i, buff, sizeof(buff)-1, 0);
                if (ret > 0) {
                    buff[ret] = 0;
                    char *nl = NULL;
                    while ((nl = strchr(clients[i].buff, '\n'))) {
                        nl[0] = 0;
                        broadcast_client_message(clients, &clients[i], i);

                        /*  j'inverse le memmove et le bufflen =
                            parce que ça évite de faire 2 fois le calcul*/
                        clients[i].bufflen = clients[i].bufflen - (nl - clients[i].buff);
                        memmove(clients[i].buff, nl+1, clients[i].bufflen);
                    }
                } else {
                    close(i);
                    char msg_buff[255];
                    sprintf(msg_buff, "server: client %d just left\n", clients[i].id);
                    clients[i].id = -1;
                    // if (clients[i].buff) {
                    //     free(clients[i].buff);
                    //     clients[i].buff = NULL;
                    //     clients[i].bufflen = 0;
                    //     clients[i].buffcap = 0;
                    // }
                    broadcast_message(clients, -1, msg_buff);
                }
            }
        }
    }
}