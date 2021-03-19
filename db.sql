create table users
(
    id       serial       not null
        constraint users_pkey
            primary key,
    email    text         not null
        constraint email
            unique,
    name     text,
    password varchar(100) not null
);

create table boards
(
    id       serial  not null
        constraint boards_pkey
            primary key,
    name     text    not null,
    owner_id integer not null
        constraint owner_id
            references users,
    note     text
);


create table columns
(
    id       serial  not null
        constraint cards_prkey
            primary key,
    name     text    not null,
    owner_id integer not null
        constraint owner_id
            references users
            on update cascade on delete cascade,
    board_id integer not null
        constraint board_id
            references boards
            on update cascade on delete cascade,
    index    integer
);

create table cards
(
    id        serial  not null
        constraint cards_pkey1
            primary key,
    name      text    not null,
    board_id  integer not null
        constraint board_id
            references boards
            on update cascade on delete cascade,
    column_id integer not null
        constraint cards_columns__fk
            references columns
            on update cascade on delete cascade,
    owner_id  integer not null
        constraint cards_users__fk
            references users
            on update cascade on delete cascade,
    index     integer
);
