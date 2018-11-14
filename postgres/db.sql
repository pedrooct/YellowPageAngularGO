--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.servico DROP CONSTRAINT servico_pkey;
ALTER TABLE IF EXISTS ONLY public.admin DROP CONSTRAINT admin_pkey;
ALTER TABLE IF EXISTS ONLY public.admin DROP CONSTRAINT admin_email_key;
DROP TABLE IF EXISTS public.servico;
DROP TABLE IF EXISTS public.admin;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: docker
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO docker;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: docker
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    email text NOT NULL,
    pass text NOT NULL
);


ALTER TABLE public.admin OWNER TO docker;

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

ALTER TABLE public.admin ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: servico; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.servico (
    id integer NOT NULL,
    nome text NOT NULL,
    morada text NOT NULL,
    cidade text NOT NULL,
    descricao text,
    telefone integer NOT NULL,
    info text,
    email text,
    website text,
    imagem text,
    countpesquisa integer
);


ALTER TABLE public.servico OWNER TO docker;

--
-- Name: servico_id_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

ALTER TABLE public.servico ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.servico_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: docker
--

COPY public.admin (id, email, pass) FROM stdin;
1	teste@gmail.com	teste
\.


--
-- Data for Name: servico; Type: TABLE DATA; Schema: public; Owner: docker
--

COPY public.servico (id, nome, morada, cidade, descricao, telefone, info, email, website, imagem,countpesquisa) FROM stdin;
\.


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, true);


--
-- Name: servico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.servico_id_seq', 1, true);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: servico servico_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT servico_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

