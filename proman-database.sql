-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id       serial                                             NOT NULL,
    email    text COLLATE pg_catalog."default"                   NOT NULL,
    name     text COLLATE pg_catalog."default",
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT email UNIQUE (email)
)
    TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to luq;


-- Table: public.boards_single

-- DROP TABLE public.boards_single;

CREATE TABLE public.boards
(
    id       serial                           NOT NULL,
    name     text COLLATE pg_catalog."default" NOT NULL,
    owner_id integer                           NOT NULL,
    note     text COLLATE pg_catalog."default",
    CONSTRAINT boards_pkey PRIMARY KEY (id),
    CONSTRAINT owner_id FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
    TABLESPACE pg_default;

ALTER TABLE public.boards
    OWNER to luq;

-- Table: public.cards

-- DROP TABLE public.cards;

CREATE TABLE public.cards
(
    id       serial                           NOT NULL,
    name     text COLLATE pg_catalog."default" NOT NULL,
    owner_id integer                           NOT NULL,
    board_id integer                           NOT NULL,
    state    text COLLATE pg_catalog."default" NOT NULL,
    note     text COLLATE pg_catalog."default",
    CONSTRAINT cards_pkey PRIMARY KEY (id),
    CONSTRAINT board_id FOREIGN KEY (board_id)
        REFERENCES public.boards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT owner_id FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
    TABLESPACE pg_default;

ALTER TABLE public.cards
    OWNER to luq;
