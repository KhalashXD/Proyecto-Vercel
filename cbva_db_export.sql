--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: acciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acciones (
    id_accion integer NOT NULL,
    tipo character varying(20),
    fecha timestamp without time zone,
    estado integer,
    info character varying(200),
    id_emergencia integer,
    id_carro integer,
    id_bombero integer
);


ALTER TABLE public.acciones OWNER TO postgres;

--
-- Name: acciones_id_accion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.acciones_id_accion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acciones_id_accion_seq OWNER TO postgres;

--
-- Name: acciones_id_accion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.acciones_id_accion_seq OWNED BY public.acciones.id_accion;


--
-- Name: bomberos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bomberos (
    id_bombero integer NOT NULL,
    nombre character varying(70),
    apellido_p character varying(30),
    apellido_m character varying(30),
    cargo character varying(15),
    cia integer,
    rescate character(1),
    hazmat character(1),
    nivel character(1),
    clave character(3)
);


ALTER TABLE public.bomberos OWNER TO postgres;

--
-- Name: bomberos_id_bombero_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bomberos_id_bombero_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bomberos_id_bombero_seq OWNER TO postgres;

--
-- Name: bomberos_id_bombero_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bomberos_id_bombero_seq OWNED BY public.bomberos.id_bombero;


--
-- Name: carros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carros (
    id_carro integer NOT NULL,
    clave integer,
    especialidad1 character varying(15),
    especialidad2 character varying(15),
    x double precision,
    y double precision
);


ALTER TABLE public.carros OWNER TO postgres;

--
-- Name: carros_id_carro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carros_id_carro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carros_id_carro_seq OWNER TO postgres;

--
-- Name: carros_id_carro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carros_id_carro_seq OWNED BY public.carros.id_carro;


--
-- Name: emergencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergencias (
    id_emergencia integer NOT NULL,
    clave character varying(4),
    calle character varying(40),
    interseccion character varying(40),
    fecha timestamp without time zone,
    x double precision,
    y double precision
);


ALTER TABLE public.emergencias OWNER TO postgres;

--
-- Name: emergencias_id_emergencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergencias_id_emergencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergencias_id_emergencia_seq OWNER TO postgres;

--
-- Name: emergencias_id_emergencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergencias_id_emergencia_seq OWNED BY public.emergencias.id_emergencia;


--
-- Name: estado_bomberos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_bomberos (
    hora timestamp without time zone,
    id_emergencia integer,
    id_bombero integer
);


ALTER TABLE public.estado_bomberos OWNER TO postgres;

--
-- Name: estado_carros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_carros (
    id_estadocarro integer NOT NULL,
    x double precision,
    y double precision,
    estado integer,
    bomberos integer,
    fecha timestamp without time zone,
    cargo integer,
    id_carro integer,
    id_accion integer
);


ALTER TABLE public.estado_carros OWNER TO postgres;

--
-- Name: estado_carros_id_estadocarro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_carros_id_estadocarro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_carros_id_estadocarro_seq OWNER TO postgres;

--
-- Name: estado_carros_id_estadocarro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_carros_id_estadocarro_seq OWNED BY public.estado_carros.id_estadocarro;


--
-- Name: estado_victimas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_victimas (
    triage integer,
    lugar character varying(100),
    hora timestamp without time zone,
    institucion character varying(15),
    id_victima integer,
    id_emergencia integer
);


ALTER TABLE public.estado_victimas OWNER TO postgres;

--
-- Name: victimas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.victimas (
    id_victima integer NOT NULL,
    nombre character varying(70),
    apellido_p character varying(30),
    apellido_m character varying(30),
    edad integer,
    sexo integer
);


ALTER TABLE public.victimas OWNER TO postgres;

--
-- Name: victimas_id_victima_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.victimas_id_victima_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.victimas_id_victima_seq OWNER TO postgres;

--
-- Name: victimas_id_victima_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.victimas_id_victima_seq OWNED BY public.victimas.id_victima;


--
-- Name: acciones id_accion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones ALTER COLUMN id_accion SET DEFAULT nextval('public.acciones_id_accion_seq'::regclass);


--
-- Name: bomberos id_bombero; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bomberos ALTER COLUMN id_bombero SET DEFAULT nextval('public.bomberos_id_bombero_seq'::regclass);


--
-- Name: carros id_carro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carros ALTER COLUMN id_carro SET DEFAULT nextval('public.carros_id_carro_seq'::regclass);


--
-- Name: emergencias id_emergencia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencias ALTER COLUMN id_emergencia SET DEFAULT nextval('public.emergencias_id_emergencia_seq'::regclass);


--
-- Name: estado_carros id_estadocarro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_carros ALTER COLUMN id_estadocarro SET DEFAULT nextval('public.estado_carros_id_estadocarro_seq'::regclass);


--
-- Name: victimas id_victima; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.victimas ALTER COLUMN id_victima SET DEFAULT nextval('public.victimas_id_victima_seq'::regclass);


--
-- Data for Name: acciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.acciones (id_accion, tipo, fecha, estado, info, id_emergencia, id_carro, id_bombero) FROM stdin;
1	Despacho inicial	2024-09-23 15:09:45	0	Carro despachado por Central CBVA	5	1	1
2	Despacho inicial	2024-09-23 15:09:45	0	Carro despachado por Central CBVA	5	5	1
3	Despacho inicial	2024-09-23 15:09:45	0	Carro despachado por Central CBVA	5	7	1
4	Despacho inicial	2024-09-23 15:10:49	0	Carro despachado por Central CBVA	6	1	1
5	Despacho inicial	2024-09-23 15:10:49	0	Carro despachado por Central CBVA	6	5	1
6	Despacho inicial	2024-09-23 15:10:49	0	Carro despachado por Central CBVA	6	7	1
7	Despacho inicial	2024-09-24 00:51:23	0	Carro despachado por Central CBVA	7	1	1
8	Despacho inicial	2024-09-24 00:53:37	0	Carro despachado por Central CBVA	8	5	1
9	Despacho inicial	2024-09-24 00:54:16	0	Carro despachado por Central CBVA	9	7	1
10	Despacho inicial	2024-09-24 00:54:16	0	Carro despachado por Central CBVA	9	10	1
11	Despacho inicial	2024-09-24 01:01:25	0	Carro despachado por Central CBVA	10	2	1
12	Despacho inicial	2024-09-24 01:02:07	0	Carro despachado por Central CBVA	11	5	1
13	Despacho inicial	2024-09-24 01:04:27	0	Carro despachado por Central CBVA	12	6	1
14	Despacho inicial	2024-09-24 01:05:15	0	Carro despachado por Central CBVA	13	3	1
15	Despacho inicial	2024-09-24 01:05:15	0	Carro despachado por Central CBVA	13	11	1
16	Despacho inicial	2024-09-24 01:05:15	0	Carro despachado por Central CBVA	13	7	1
17	Despacho inicial	2024-09-24 13:13:34	0	Carro despachado por Central CBVA	14	6	1
18	Despacho inicial	2024-09-24 13:13:34	0	Carro despachado por Central CBVA	14	2	1
19	Despacho inicial	2024-09-24 23:40:48	0	Carro despachado por Central CBVA	15	10	1
20	Despacho inicial	2024-09-24 23:40:48	0	Carro despachado por Central CBVA	15	7	1
21	Despacho inicial	2024-09-25 00:24:28	0	Carro despachado por Central CBVA	16	8	1
22	Despacho inicial	2024-09-25 00:27:57	0	Carro despachado por Central CBVA	17	3	1
23	Despacho inicial	2024-09-25 00:27:57	0	Carro despachado por Central CBVA	17	11	1
24	Despacho inicial	2024-09-25 00:27:57	0	Carro despachado por Central CBVA	17	6	1
25	Despacho inicial	2024-09-25 10:44:36	0	Carro despachado por Central CBVA	18	8	1
26	Despacho inicial	2024-09-25 10:44:36	0	Carro despachado por Central CBVA	18	3	1
27	Despacho inicial	2024-09-25 10:44:36	0	Carro despachado por Central CBVA	18	6	1
28	Despacho inicial	2024-09-25 10:44:36	0	Carro despachado por Central CBVA	18	11	1
29	Despacho inicial	2024-09-28 18:17:45	0	Carro despachado por Central CBVA	22	8	1
30	Despacho inicial	2024-09-28 18:56:52	0	Carro despachado por Central CBVA	23	6	1
31	Despacho inicial	2024-09-28 18:56:52	0	Carro despachado por Central CBVA	23	1	1
32	Despacho inicial	2024-09-28 19:38:02	0	Carro despachado por Central CBVA	24	4	1
33	Despacho inicial	2024-09-28 19:39:24	0	Carro despachado por Central CBVA	25	9	1
34	Despacho inicial	2024-09-28 19:42:25	0	Carro despachado por Central CBVA	26	9	1
35	Despacho inicial	2024-09-30 17:14:45	0	Carro despachado por Central CBVA	27	5	1
36	Despacho inicial	2024-09-30 17:31:35	0	Carro despachado por Central CBVA	28	1	1
37	Despacho inicial	2024-09-30 17:31:35	0	Carro despachado por Central CBVA	28	6	1
38	Despacho inicial	2024-09-30 17:45:17	0	Carro despachado por Central CBVA	29	9	1
39	Despacho inicial	2024-09-30 19:02:24	0	Carro despachado por Central CBVA	30	3	1
40	Despacho inicial	2024-09-30 19:02:24	0	Carro despachado por Central CBVA	30	11	1
41	Despacho inicial	2024-09-30 19:02:24	0	Carro despachado por Central CBVA	30	5	1
42	Despacho inicial	2024-09-30 19:02:24	0	Carro despachado por Central CBVA	30	7	1
43	Despacho inicial	2024-09-30 19:07:11	0	Carro despachado por Central CBVA	31	10	1
44	Despacho inicial	2024-09-30 19:07:11	0	Carro despachado por Central CBVA	31	3	1
45	Despacho inicial	2024-10-10 00:29:10	0	Carro despachado por Central CBVA	32	2	1
46	Despacho inicial	2024-10-10 00:32:41	0	Carro despachado por Central CBVA	33	1	1
47	Despacho inicial	2024-10-10 00:35:45	0	Carro despachado por Central CBVA	34	1	1
48	Despacho inicial	2024-10-10 00:35:45	0	Carro despachado por Central CBVA	34	6	1
49	Despacho inicial	2024-10-10 00:45:19	0	Carro despachado por Central CBVA	35	4	1
50	Despacho inicial	2024-10-10 00:57:17	0	Carro despachado por Central CBVA	36	8	1
51	Despacho inicial	2024-10-11 09:12:20	0	Carro despachado por Central CBVA	37	6	1
52	Despacho inicial	2024-10-11 09:14:38	0	Carro despachado por Central CBVA	38	6	1
53	Despacho inicial	2024-10-11 09:22:07	0	Carro despachado por Central CBVA	39	4	1
54	Despacho inicial	2024-10-11 11:26:07	0	Carro despachado por Central CBVA	40	4	1
55	Despacho inicial	2024-10-11 11:52:51	0	Carro despachado por Central CBVA	41	1	1
56	Despacho inicial	2024-10-11 11:52:51	0	Carro despachado por Central CBVA	41	6	1
57	Despacho inicial	2024-10-11 11:52:51	0	Carro despachado por Central CBVA	41	8	1
58	Despacho inicial	2024-10-11 11:57:37	0	Carro despachado por Central CBVA	42	4	1
59	Despacho inicial	2024-10-11 11:57:37	0	Carro despachado por Central CBVA	42	8	1
60	Despacho inicial	2024-10-11 11:57:37	0	Carro despachado por Central CBVA	42	6	1
61	Despacho inicial	2024-10-11 11:58:57	0	Carro despachado por Central CBVA	43	4	1
62	Despacho inicial	2024-10-11 12:03:06	0	Carro despachado por Central CBVA	44	1	1
63	Despacho inicial	2024-10-11 12:03:06	0	Carro despachado por Central CBVA	44	6	1
64	Despacho inicial	2024-10-11 12:11:12	0	Carro despachado por Central CBVA	45	8	1
65	Despacho inicial	2024-10-11 12:12:46	0	Carro despachado por Central CBVA	46	1	1
66	Despacho inicial	2024-10-11 12:19:31	0	Carro despachado por Central CBVA	47	1	1
67	Despacho inicial	2024-10-11 12:19:31	0	Carro despachado por Central CBVA	47	6	1
68	Despacho inicial	2024-10-11 12:19:31	0	Carro despachado por Central CBVA	47	8	1
69	Despacho inicial	2024-10-11 12:19:45	0	Carro despachado por Central CBVA	48	1	1
70	Despacho inicial	2024-10-11 12:19:45	0	Carro despachado por Central CBVA	48	6	1
71	Despacho inicial	2024-10-11 12:19:45	0	Carro despachado por Central CBVA	48	8	1
72	Despacho inicial	2024-10-11 12:22:10	0	Carro despachado por Central CBVA	49	8	1
73	Despacho inicial	2024-10-11 12:22:10	0	Carro despachado por Central CBVA	49	1	1
74	Despacho inicial	2024-10-11 12:22:43	0	Carro despachado por Central CBVA	50	1	1
75	Despacho inicial	2024-10-11 12:22:43	0	Carro despachado por Central CBVA	50	6	1
76	Despacho inicial	2024-10-11 12:23:05	0	Carro despachado por Central CBVA	51	6	1
77	Despacho inicial	2024-10-11 12:24:44	0	Carro despachado por Central CBVA	52	1	1
78	Despacho inicial	2024-10-11 12:24:44	0	Carro despachado por Central CBVA	52	6	1
79	Despacho inicial	2024-10-11 12:24:44	0	Carro despachado por Central CBVA	52	8	1
80	Despacho inicial	2024-10-11 12:37:08	0	Carro despachado por Central CBVA	53	4	1
81	Despacho inicial	2024-10-11 12:37:08	0	Carro despachado por Central CBVA	53	8	1
82	Despacho inicial	2024-10-11 12:37:08	0	Carro despachado por Central CBVA	53	6	1
83	Despacho inicial	2024-10-11 12:50:14	0	Carro despachado por Central CBVA	54	2	1
84	Despacho inicial	2024-10-11 12:55:54	0	Carro despachado por Central CBVA	55	1	1
85	Despacho inicial	2024-10-11 12:56:42	0	Carro despachado por Central CBVA	56	4	1
86	Despacho inicial	2024-10-11 12:56:42	0	Carro despachado por Central CBVA	56	6	1
87	Despacho inicial	2024-10-11 12:56:42	0	Carro despachado por Central CBVA	56	8	1
88	Despacho inicial	2024-10-11 12:56:56	0	Carro despachado por Central CBVA	57	8	1
89	Despacho inicial	2024-10-11 13:11:26	0	Carro despachado por Central CBVA	58	4	1
90	Despacho inicial	2024-10-11 13:12:46	0	Carro despachado por Central CBVA	59	1	1
91	Despacho inicial	2024-10-11 13:12:46	0	Carro despachado por Central CBVA	59	6	1
92	Despacho inicial	2024-10-11 13:13:01	0	Carro despachado por Central CBVA	60	8	1
93	Despacho inicial	2024-10-11 13:14:39	0	Carro despachado por Central CBVA	61	1	1
94	Despacho inicial	2024-10-11 13:14:39	0	Carro despachado por Central CBVA	61	6	1
95	Despacho inicial	2024-10-11 13:15:42	0	Carro despachado por Central CBVA	62	1	1
96	Despacho inicial	2024-10-11 13:15:42	0	Carro despachado por Central CBVA	62	6	1
97	Despacho inicial	2024-10-11 16:23:00	0	Carro despachado por Central CBVA	63	6	1
98	Despacho inicial	2024-10-11 16:25:24	0	Carro despachado por Central CBVA	64	1	1
99	Despacho inicial	2024-10-11 16:25:24	0	Carro despachado por Central CBVA	64	8	1
100	Despacho inicial	2024-10-11 16:25:54	0	Carro despachado por Central CBVA	65	1	1
101	Despacho inicial	2024-10-11 16:25:54	0	Carro despachado por Central CBVA	65	6	1
102	Despacho inicial	2024-10-11 16:25:54	0	Carro despachado por Central CBVA	65	8	1
103	Despacho inicial	2024-10-11 16:27:01	0	Carro despachado por Central CBVA	66	4	1
104	Despacho inicial	2024-10-11 16:28:04	0	Carro despachado por Central CBVA	67	4	1
105	Despacho inicial	2024-10-11 16:29:09	0	Carro despachado por Central CBVA	68	8	1
106	Despacho inicial	2024-10-11 16:29:09	0	Carro despachado por Central CBVA	68	1	1
107	Despacho inicial	2024-10-11 16:29:09	0	Carro despachado por Central CBVA	68	6	1
108	Despacho inicial	2024-10-11 16:30:12	0	Carro despachado por Central CBVA	69	8	1
109	Despacho inicial	2024-10-11 16:30:12	0	Carro despachado por Central CBVA	69	1	1
110	Despacho inicial	2024-10-12 17:30:25	0	Carro despachado por Central CBVA	70	2	1
111	Despacho inicial	2024-10-12 17:46:26	0	Carro despachado por Central CBVA	71	6	1
112	Despacho inicial	2024-10-12 17:46:26	0	Carro despachado por Central CBVA	71	8	1
113	Despacho inicial	2024-10-12 17:48:35	0	Carro despachado por Central CBVA	72	1	1
114	Despacho inicial	2024-10-12 18:21:36	0	Carro despachado por Central CBVA	73	4	1
115	Despacho inicial	2024-10-12 18:22:08	0	Carro despachado por Central CBVA	74	2	1
116	Despacho inicial	2024-10-12 18:22:08	0	Carro despachado por Central CBVA	74	6	1
\.


--
-- Data for Name: bomberos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bomberos (id_bombero, nombre, apellido_p, apellido_m, cargo, cia, rescate, hazmat, nivel, clave) FROM stdin;
1	CENTRAL	VILLA	ALEMANA	central	0	n	n	n	0  
3	Cristóbal	Morales	Flores	Bombero	1	S	S	P	1-9
4	Natalia	Vergara	Castro	Bombero	2	N	N	P	2-9
5	Martina	Valenzuela	Gómez	Bombero	3	S	S	O	3-9
6	Natalia	Morales	Ramírez	Bombero	4	N	S	P	4-9
7	Amanda	Núñez	Herrera	Bombero	1	N	N	O	1-9
8	Gabriel	Fernández	Espinoza	Bombero	3	N	S	O	3-9
9	Camila	Torres	Martínez	Bombero	1	N	S	P	1-9
10	Lorenzo	Rodríguez	Torres	Bombero	1	S	S	O	1-9
11	Benjamín	Martínez	González	Bombero	1	N	S	I	1-9
12	Antonia	Flores	Ramírez	Bombero	3	N	N	I	3-9
13	Carolina	Núñez	Fuentes	Bombero	3	S	S	P	3-9
14	Iván	Torres	Espinoza	Bombero	4	N	S	P	4-9
15	Iván	Ramírez	Díaz	Bombero	1	N	N	O	1-9
16	Simón	Fernández	Espinoza	Bombero	3	N	S	O	3-9
17	Sebastián	López	Silva	Bombero	1	S	S	O	1-9
18	Iván	Jara	Sánchez	Bombero	2	N	S	I	2-9
19	Rocío	Rojas	Valenzuela	Bombero	2	N	S	I	2-9
20	Amanda	Vásquez	Torres	1Teniente	4	S	S	P	4-1
21	Ignacio	Espinoza	Álvarez	Bombero	3	S	S	O	3-9
22	Catalina	Valenzuela	Silva	Bombero	3	S	N	O	3-9
23	Marcelo	Vásquez	Soto	Bombero	2	N	N	P	2-9
24	Rosario	Díaz	Morales	Bombero	1	N	S	I	1-9
25	Agustín	Reyes	Figueroa	Bombero	1	S	S	P	1-9
26	Iván	Vásquez	Rodríguez	Bombero	3	N	N	P	3-9
27	Santiago	Muñoz	Hernández	Bombero	3	S	N	O	3-9
28	Maximiliano	Torres	Rojas	Bombero	4	N	N	O	4-9
29	Patricio	Álvarez	Carrasco	Bombero	2	N	S	I	2-9
30	Francisca	Muñoz	Hernández	Bombero	3	S	S	I	3-9
31	Francisco	Rojas	Vásquez	Bombero	3	S	N	O	3-9
32	Maximiliano	Torres	Álvarez	Bombero	3	S	S	O	3-9
33	Juan	Silva	Díaz	Bombero	1	N	N	P	1-9
34	Fernanda	Vásquez	Herrera	Bombero	1	N	N	P	1-9
35	Patricio	Silva	Cortés	Bombero	2	S	S	O	2-9
36	Camilo	Bravo	Pérez	Bombero	2	S	N	P	2-9
37	Maximiliano	Tapia	Díaz	Bombero	3	N	N	O	3-9
38	Laura	Morales	Valenzuela	Bombero	1	S	N	P	1-9
39	Gabriel	González	Sepúlveda	Bombero	4	N	N	O	4-9
40	Daniela	Reyes	Rojas	Bombero	1	S	N	I	1-9
41	Cristóbal	Riquelme	Figueroa	Bombero	3	S	N	I	3-9
42	Rosario	Riquelme	Álvarez	Bombero	3	S	S	O	3-9
43	Leonardo	Herrera	Gutiérrez	Capitán	4	S	S	O	M-4
44	Catalina	Rojas	Valenzuela	Bombero	2	N	S	O	2-9
45	Marcelo	Espinoza	Hernández	Bombero	3	N	N	I	3-9
46	Lorenzo	Hernández	Carrasco	Bombero	3	N	N	O	3-9
47	Patricio	Valenzuela	Ramírez	Bombero	3	S	N	I	3-9
48	Benjamín	Martínez	Fuentes	Bombero	1	N	S	O	1-9
49	Juan	Espinoza	Araya	Bombero	3	S	N	O	3-9
50	Fernanda	Ramírez	Vásquez	Bombero	1	S	S	P	1-9
51	Javiera	González	Espinoza	Bombero	2	N	S	O	2-9
52	Santiago	Soto	Martínez	Bombero	4	N	S	I	4-9
53	Sebastián	Riquelme	Contreras	Bombero	4	S	N	P	4-9
54	Tomás	Fernández	Jara	Bombero	3	N	S	O	3-9
55	Rodrigo	Jara	Valenzuela	Bombero	3	S	S	O	3-9
56	Víctor	Pérez	Torres	Bombero	2	S	S	O	2-9
57	Ricardo	Gómez	Bravo	1Teniente	1	N	S	P	1-1
58	Antonia	Silva	Vargas	Bombero	1	S	N	O	1-9
59	Rocío	Valenzuela	Bravo	Bombero	4	N	S	I	4-9
60	Fernanda	Jara	Reyes	Bombero	1	N	S	O	1-9
61	Juan	Espinoza	Hernández	Bombero	3	N	N	O	3-9
62	Josefina	Vásquez	López	Bombero	4	N	S	O	4-9
63	Matías	Álvarez	Castillo	Bombero	1	S	S	I	1-9
64	Francisca	Jara	Vásquez	Bombero	3	N	S	O	3-9
65	Belén	Torres	Díaz	Bombero	4	S	S	O	4-9
66	Maximiliano	Vásquez	Figueroa	Bombero	2	N	S	I	2-9
67	Josefina	Sepúlveda	Tapia	Bombero	2	S	N	O	2-9
68	Josefina	Castro	Herrera	Bombero	4	S	N	I	4-9
69	Victoria	Martínez	Cortés	Bombero	4	S	S	O	4-9
70	Sebastián	Araya	Araya	Bombero	3	N	S	P	3-9
71	Pedro	Reyes	Rojas	Bombero	1	S	N	O	1-9
72	Agustín	Vargas	Riquelme	Bombero	3	N	S	O	3-9
73	Francisco	Vargas	Morales	Bombero	3	N	N	I	3-9
74	Ricardo	Díaz	Pérez	Bombero	3	N	S	I	3-9
75	Matías	Tapia	Rivera	Bombero	3	N	S	P	3-9
76	Ricardo	Pérez	Herrera	Bombero	2	S	S	P	2-9
77	Victoria	Rodríguez	Núñez	Bombero	3	S	N	P	3-9
78	Natalia	López	Espinoza	Bombero	2	N	S	I	2-9
79	Francisco	González	Contreras	Bombero	2	N	S	I	2-9
80	Valentina	Cortés	González	Bombero	3	S	S	O	3-9
81	Ricardo	Pérez	López	Bombero	1	N	S	O	1-9
82	Cristóbal	Sánchez	Vásquez	Bombero	1	N	N	O	1-9
83	Francisca	Castillo	Cortés	Bombero	1	N	N	O	1-9
84	Antonia	Rojas	Rojas	Bombero	1	N	N	I	1-9
85	Cristóbal	Reyes	Carrasco	Bombero	4	S	S	O	4-9
86	Maximiliano	Rivera	Castro	Bombero	1	N	S	O	1-9
87	Gabriel	Riquelme	Vergara	Bombero	3	N	S	I	3-9
88	Daniela	Torres	Martínez	Bombero	2	S	N	O	2-9
89	Francisco	Fuentes	Rodríguez	Bombero	4	N	S	I	4-9
90	Camilo	Sepúlveda	Hernández	Bombero	1	N	N	O	1-9
91	Valentina	Jara	Vargas	Bombero	2	N	N	I	2-9
92	Valentina	Rivera	Jara	Bombero	2	S	S	P	2-9
93	Juan	Silva	Araya	Bombero	3	N	N	I	3-9
94	Juan	Fernández	Ramírez	Bombero	2	N	S	O	2-9
95	Sebastián	Sepúlveda	Castro	Bombero	3	N	S	O	3-9
96	Pedro	Riquelme	Soto	Bombero	2	S	N	O	2-9
97	Catalina	Sánchez	Álvarez	Bombero	4	N	N	P	4-9
98	Emilia	González	Herrera	Bombero	3	N	S	I	3-9
99	Simón	Torres	Jara	Bombero	4	N	S	O	4-9
100	Jorge	Núñez	Díaz	Bombero	4	S	N	P	4-9
101	Camila	Sepúlveda	Rojas	Bombero	3	N	N	P	3-9
102	Rosario	Contreras	Sánchez	Bombero	4	N	N	P	4-9
103	Rocío	Vásquez	Martínez	Bombero	1	S	N	P	1-9
104	Camila	Pérez	Gómez	Bombero	4	N	N	O	4-9
105	David	Sepúlveda	Silva	Bombero	3	S	S	O	3-9
106	Antonia	Ramírez	Flores	Bombero	2	S	S	O	2-9
107	Javiera	Cortés	Riquelme	Bombero	4	N	N	O	4-9
108	Laura	Araya	Bravo	Bombero	3	N	S	P	3-9
109	Ignacio	Torres	Tapia	Bombero	3	N	S	P	3-9
110	Rodrigo	Bravo	Vásquez	Bombero	2	N	N	P	2-9
111	Camila	Vásquez	Fuentes	Bombero	4	N	N	O	4-9
112	Pedro	López	Álvarez	Bombero	1	S	N	O	1-9
113	Javiera	Rivera	Vargas	Bombero	4	S	N	O	4-9
114	Camila	Castillo	Soto	Bombero	2	S	N	O	2-9
115	Gabriel	Fernández	Castillo	Bombero	4	S	N	O	4-9
116	Martina	Jara	Vásquez	Bombero	2	S	N	O	2-9
117	Marcelo	Figueroa	Sánchez	Bombero	4	N	N	O	4-9
118	Ricardo	Bravo	Morales	Bombero	2	S	N	I	2-9
119	Martín	Castillo	Rojas	Bombero	2	N	N	O	2-9
120	Benjamín	Vargas	Fuentes	Bombero	4	S	S	I	4-9
121	Martín	Contreras	Díaz	Bombero	2	S	N	P	2-9
122	Santiago	Contreras	Flores	Bombero	3	S	N	I	3-9
123	Camilo	Vergara	Morales	Bombero	4	S	N	P	4-9
124	Emilia	Morales	Pérez	Bombero	4	N	N	I	4-9
125	Lorenzo	Flores	Pérez	Bombero	3	N	N	P	3-9
126	Camila	Flores	Gutiérrez	Bombero	4	N	N	O	4-9
127	Amanda	Valenzuela	Valenzuela	Bombero	1	N	N	I	1-9
128	Javiera	Gómez	Tapia	Bombero	2	S	S	P	2-9
129	Martín	Núñez	Torres	Bombero	4	N	N	O	4-9
130	Agustín	Araya	Gómez	2Teniente	1	S	S	O	1-2
131	Gabriel	Valenzuela	Reyes	Bombero	1	S	N	O	1-9
132	Antonia	Carrasco	Vargas	Bombero	2	N	S	O	2-9
133	Jorge	Castro	Muñoz	Bombero	2	N	N	P	2-9
134	Josefina	Vásquez	Muñoz	Bombero	2	N	N	P	2-9
135	Iván	Soto	López	Bombero	4	S	S	I	4-9
136	Antonia	Valenzuela	Sepúlveda	Bombero	3	S	S	P	3-9
137	Benjamín	Rodríguez	Herrera	Bombero	2	N	N	O	2-9
138	Joaquín	Gutiérrez	Bravo	2Teniente	4	S	S	P	4-2
139	Agustín	Fernández	Núñez	Bombero	2	N	S	O	2-9
140	Rocío	Hernández	Gómez	Bombero	4	N	S	I	4-9
141	Maximiliano	Rivera	Pérez	Bombero	2	N	S	P	2-9
142	Antonia	Gómez	Rojas	Bombero	2	N	S	O	2-9
143	Víctor	Castro	Contreras	3Teniente	4	S	S	P	4-3
144	Patricio	Jara	Rodríguez	Bombero	4	S	N	P	4-9
145	Natalia	Núñez	Vargas	Bombero	3	N	N	P	3-9
146	Gabriel	Vergara	Morales	Bombero	2	S	S	O	2-9
147	Maximiliano	Flores	Jara	Bombero	2	N	S	I	2-9
148	Rocío	Fernández	Rodríguez	Bombero	2	S	N	O	2-9
149	Martín	Rodríguez	Torres	Bombero	2	N	S	P	2-9
150	Santiago	Araya	Valenzuela	Bombero	2	S	S	I	2-9
151	Rodrigo	Herrera	Vásquez	Bombero	3	S	S	O	3-9
152	Laura	Contreras	Gómez	Bombero	4	S	N	I	4-9
153	Pedro	Riquelme	Araya	Bombero	4	S	S	P	4-9
154	Camila	Reyes	Contreras	Bombero	1	S	N	O	1-9
155	Javiera	Contreras	Bravo	Bombero	3	S	S	O	3-9
156	Ignacio	Morales	Riquelme	Bombero	1	S	N	O	1-9
157	Rocío	Vergara	López	Bombero	4	N	S	O	4-9
158	Juan	Riquelme	Reyes	Bombero	3	S	S	O	3-9
159	Jorge	Díaz	Sánchez	Bombero	2	S	N	P	2-9
160	Laura	Martínez	Contreras	Bombero	4	S	S	O	4-9
161	Juan	Vargas	Torres	Bombero	4	S	S	P	4-9
162	Camila	Hernández	Vásquez	Bombero	4	S	S	O	4-9
163	Simón	Figueroa	Torres	1Teniente	2	S	S	O	2-1
164	Marcelo	Bravo	Castillo	Bombero	3	S	N	O	3-9
165	Antonia	Muñoz	Herrera	Bombero	4	N	N	O	4-9
166	Rodrigo	Carrasco	Hernández	Bombero	2	N	N	O	2-9
167	Amanda	Vargas	Contreras	Bombero	2	S	S	P	2-9
168	Maximiliano	Espinoza	Morales	Bombero	3	S	S	O	3-9
169	Patricio	Soto	Rodríguez	Bombero	3	S	N	O	3-9
170	Belén	Torres	Araya	Bombero	4	N	S	O	4-9
171	Javiera	Tapia	Jara	Bombero	2	N	N	P	2-9
172	Daniela	Vergara	Rivera	Bombero	4	S	S	I	4-9
173	Victoria	Fernández	Herrera	Bombero	1	S	N	O	1-9
174	Carolina	Hernández	Pérez	Bombero	4	N	S	P	4-9
175	Iván	Rojas	Silva	Bombero	2	N	S	O	2-9
176	Simón	Rojas	Espinoza	Bombero	1	S	S	O	1-9
177	Natalia	Soto	González	Bombero	3	S	S	P	3-9
178	Javiera	Hernández	Rodríguez	Bombero	2	S	S	P	2-9
179	Valentina	Hernández	Fuentes	Bombero	3	S	N	I	3-9
180	Martina	Castillo	Contreras	Bombero	1	N	N	P	1-9
181	Antonia	Sepúlveda	Castro	Bombero	3	S	S	O	3-9
182	Tomás	Carrasco	Araya	Bombero	3	N	N	O	3-9
183	Rocío	Álvarez	Díaz	Bombero	3	N	N	I	3-9
184	Rodrigo	Fuentes	Núñez	Bombero	2	S	N	I	2-9
185	Maximiliano	Ramírez	Castillo	Bombero	1	S	S	P	1-9
186	Camilo	Castillo	Rodríguez	Bombero	1	S	N	O	1-9
187	Valentina	Torres	Fuentes	Bombero	1	S	N	I	1-9
188	Antonia	Pérez	Díaz	Bombero	3	N	S	O	3-9
189	Leonardo	Álvarez	Gutiérrez	Bombero	1	N	S	P	1-9
190	Matías	Rodríguez	Torres	3Teniente	1	S	S	P	1-3
191	David	Ramírez	Fuentes	Bombero	2	N	S	P	2-9
192	Simón	Vergara	Núñez	Bombero	1	S	S	I	1-9
193	Gabriel	Tapia	Reyes	Bombero	3	N	N	O	3-9
194	Francisco	Morales	Bravo	Bombero	3	S	S	O	3-9
195	Ignacio	Figueroa	Vargas	Bombero	3	N	N	I	3-9
196	Daniela	Cortés	Bravo	Bombero	3	S	N	O	3-9
197	Martín	Pérez	Castro	Bombero	3	N	N	P	3-9
198	Camilo	Rodríguez	Díaz	Bombero	1	N	S	I	1-9
199	Pedro	Castro	Jara	Bombero	3	S	N	P	3-9
200	Simón	Muñoz	Valenzuela	Bombero	4	S	N	P	4-9
201	Martina	Núñez	Rivera	Bombero	4	N	S	P	4-9
202	Lorenzo	Bravo	Bravo	Capitán	2	S	S	O	M-2
203	Maximiliano	Reyes	Fuentes	Bombero	4	N	S	O	4-9
204	Benjamín	Morales	Fernández	Bombero	2	S	N	P	2-9
205	Jorge	Riquelme	Araya	Bombero	2	N	N	I	2-9
206	Rodrigo	Fernández	Reyes	2Teniente	2	S	S	O	2-2
207	Gabriel	Soto	Carrasco	Bombero	4	N	S	P	4-9
208	Martina	Figueroa	Morales	Bombero	2	S	S	O	2-9
209	Pedro	Contreras	Sepúlveda	Bombero	1	N	N	O	1-9
210	Emilia	Fernández	Ramírez	Bombero	2	S	S	O	2-9
211	Gabriel	Silva	Jara	Bombero	2	S	N	O	2-9
212	Daniela	Rodríguez	Álvarez	3Teniente	3	S	S	P	3-3
213	Antonia	Álvarez	Jara	Bombero	1	S	S	P	1-9
214	Francisco	Castro	Araya	Bombero	1	N	S	P	1-9
215	Francisca	Jara	Gómez	Bombero	2	N	S	I	2-9
216	Lorenzo	Tapia	Sepúlveda	Bombero	4	N	S	O	4-9
217	Daniela	Tapia	Muñoz	Bombero	4	N	N	O	4-9
218	Laura	Flores	Castillo	Bombero	1	N	N	O	1-9
219	Amanda	Espinoza	Cortés	Bombero	4	S	S	P	4-9
220	Natalia	Gómez	Pérez	Bombero	1	S	N	O	1-9
221	Leonardo	Sepúlveda	López	Bombero	3	N	S	P	3-9
222	Rodrigo	Vergara	Núñez	Bombero	1	S	N	O	1-9
223	Pedro	Núñez	Reyes	Bombero	2	N	S	P	2-9
224	Sebastián	Espinoza	Riquelme	Bombero	2	S	N	O	2-9
225	Antonia	Rivera	Silva	Bombero	2	N	N	O	2-9
226	Benjamín	Sánchez	Araya	Capitán	1	S	S	P	M-1
227	Josefina	Núñez	Torres	Bombero	2	S	N	O	2-9
228	Ignacio	Gómez	Castro	Bombero	2	S	N	O	2-9
229	Santiago	Torres	Flores	Bombero	2	S	S	I	2-9
230	Belén	Morales	Vergara	Bombero	4	N	N	P	4-9
231	Santiago	Sánchez	Díaz	Bombero	1	S	N	O	1-9
232	Lorenzo	Ramírez	González	Bombero	1	S	N	I	1-9
233	Sebastián	Torres	Castillo	Bombero	1	S	S	O	1-9
234	Rodrigo	Castillo	Morales	Bombero	1	N	N	O	1-9
235	Simón	Araya	Flores	Bombero	1	N	S	I	1-9
236	Tomás	Álvarez	Muñoz	Bombero	3	S	S	O	3-9
237	David	Gutiérrez	Araya	Bombero	1	S	S	O	1-9
238	Francisco	Díaz	Castro	Bombero	4	S	S	P	4-9
239	Matías	Pérez	Morales	2Teniente	3	S	S	P	3-2
240	Antonia	Castro	Torres	Bombero	3	N	S	O	3-9
241	Sebastián	Rodríguez	Martínez	Bombero	3	S	N	P	3-9
242	Antonia	Muñoz	Vásquez	Bombero	4	S	N	O	4-9
243	Jorge	Rojas	Díaz	Bombero	1	N	N	O	1-9
244	Rocío	Silva	Sepúlveda	Bombero	1	N	S	O	1-9
245	Amanda	Hernández	Rodríguez	Bombero	1	S	N	O	1-9
246	Catalina	Sánchez	Vásquez	Bombero	1	N	N	P	1-9
247	Belén	Martínez	Castillo	Bombero	1	N	N	P	1-9
248	Josefina	Álvarez	Vergara	Bombero	4	N	S	O	4-9
249	Rodrigo	Vergara	Silva	Bombero	4	S	S	O	4-9
250	Lorenzo	Gómez	González	Bombero	2	S	N	P	2-9
251	Amanda	Pérez	Martínez	Bombero	1	N	S	P	1-9
252	Valentina	Reyes	Cortés	Bombero	1	N	S	O	1-9
253	Antonia	Castro	Vargas	Bombero	1	N	N	P	1-9
254	Pedro	Núñez	Morales	Bombero	1	N	N	O	1-9
255	Gabriel	Torres	Fuentes	Bombero	3	S	S	I	3-9
256	Benjamín	Morales	Araya	Bombero	4	N	N	P	4-9
257	Camila	Figueroa	Torres	Bombero	3	S	N	O	3-9
258	Víctor	Rodríguez	Bravo	Bombero	4	S	N	O	4-9
259	Simón	Castillo	Núñez	Bombero	3	N	N	O	3-9
260	David	Gómez	Muñoz	Bombero	4	N	N	P	4-9
261	Matías	Rodríguez	Sánchez	Bombero	3	N	N	O	3-9
262	Agustín	Martínez	Carrasco	Bombero	1	N	N	P	1-9
263	Víctor	Castillo	Rivera	Bombero	1	N	N	O	1-9
264	Antonia	Espinoza	Jara	Bombero	1	S	S	O	1-9
265	Josefina	Rojas	Silva	Bombero	3	N	S	O	3-9
266	David	González	Castro	Bombero	3	N	N	P	3-9
267	Ricardo	Espinoza	Contreras	1Teniente	3	S	S	O	3-1
268	Antonia	Sánchez	Hernández	Bombero	1	S	N	I	1-9
269	Jorge	Rojas	Morales	Capitán	3	S	S	P	M-3
270	Belén	Sepúlveda	Álvarez	Bombero	2	S	N	P	2-9
271	Agustín	Martínez	Vergara	Bombero	2	S	N	I	2-9
272	Rocío	Pérez	Díaz	Bombero	3	N	N	O	3-9
273	David	Riquelme	Riquelme	3Teniente	2	S	S	O	2-3
274	Ricardo	Jara	Hernández	Bombero	4	N	S	I	4-9
275	Marcelo	Fernández	Fernández	Bombero	2	N	N	I	2-9
276	Laura	Martínez	Espinoza	Bombero	2	N	N	O	2-9
277	Victoria	Sánchez	Sepúlveda	Bombero	1	N	N	O	1-9
278	Patricio	Contreras	Sánchez	Bombero	4	S	N	O	4-9
279	Victoria	Díaz	Díaz	Bombero	3	S	N	P	3-9
280	Josefina	Riquelme	Torres	Bombero	2	S	N	O	2-9
281	Camila	Núñez	Díaz	Bombero	1	S	S	O	1-9
282	Jorge	Torres	Gómez	Bombero	4	N	N	P	4-9
283	Matías	López	Núñez	Bombero	1	N	S	O	1-9
284	Simón	Torres	Castillo	Bombero	4	S	N	O	4-9
285	Ignacio	González	Muñoz	Bombero	4	N	S	I	4-9
286	Víctor	Valenzuela	González	Bombero	1	N	S	O	1-9
287	Camila	Vargas	Gutiérrez	Bombero	1	N	S	P	1-9
288	Rodrigo	Núñez	Figueroa	Bombero	1	S	S	P	1-9
289	Cristóbal	López	Carrasco	Bombero	4	N	S	P	4-9
290	Benjamín	Espinoza	Fuentes	Bombero	3	S	N	I	3-9
291	Belén	Soto	Contreras	Bombero	2	S	N	I	2-9
292	Martín	Figueroa	Figueroa	Bombero	2	N	N	P	2-9
293	Josefina	Valenzuela	Martínez	Bombero	2	N	N	O	2-9
294	Josefina	Fernández	Morales	Bombero	2	N	S	P	2-9
295	Iván	Hernández	Pérez	Bombero	1	N	N	O	1-9
296	Iván	Muñoz	Herrera	Bombero	3	N	N	O	3-9
297	Francisca	Fernández	Díaz	Bombero	4	N	S	P	4-9
298	Pedro	Araya	Tapia	Bombero	1	N	N	I	1-9
299	Camila	Reyes	González	Bombero	1	N	S	O	1-9
300	Francisco	Silva	Cortés	Bombero	1	N	N	I	1-9
301	Francisca	Rodríguez	Espinoza	Bombero	4	S	N	I	4-9
302	Lorenzo	Fernández	Riquelme	Bombero	3	S	S	O	3-9
\.


--
-- Data for Name: carros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carros (id_carro, clave, especialidad1, especialidad2, x, y) FROM stdin;
1	11	bomba	forestal	-33.0485097	-71.3771123
2	12	forestal	bomba	-33.0485097	-71.3771123
3	13	bomba	forestal	-33.0485097	-71.3771123
4	14	rescate	bomba	-33.0485097	-71.3771123
5	21	bomba	forestal	-33.0435523	-71.3722742
6	22	forestal	bomba	-33.0435523	-71.3722742
7	31	bomba	forestal	-33.0466061	-71.3533567
8	32	forestal	bomba	-33.0466061	-71.3533567
9	33	rescate	bomba	-33.0466061	-71.3533567
10	41	bomba	forestal	-33.0562161	-71.3912396
11	42	forestal	bomba	-33.0562161	-71.3912396
12	43	aljibe	aljibe	-33.0562161	-71.3912396
\.


--
-- Data for Name: emergencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergencias (id_emergencia, clave, calle, interseccion, fecha, x, y) FROM stdin;
1	1-1	Bilbao	Paul Harris	2024-09-21 21:24:00	-33.0645217	-71.3618842
2	2-1	Avenida Valparaíso	Pasaje Ferrari	2024-09-23 11:14:19	-33.0443747	-71.3799392
3	1-1	Pasaje Granizo	Las Piedras	2024-09-23 15:06:38	-33.06245	-71.3835087
4	1-1	Pasaje Granizo	Las Piedras	2024-09-23 15:08:24	-33.06245	-71.3835087
5	1-1	Pasaje Granizo	Las Piedras	2024-09-23 15:09:45	-33.06245	-71.3835087
6	1-1	Pasaje Granizo	Las Piedras	2024-09-23 15:10:49	-33.06245	-71.3835087
7	2-1	Pasaje Granizo	Jarilla	2024-09-24 00:51:23	-33.0624713	-71.3823881
8	2-1	Pasaje Granizo	Jarilla	2024-09-24 00:53:37	-33.0624713	-71.3823881
9	1-3	Pasaje Granizo	Jarilla	2024-09-24 00:54:16	-33.0624713	-71.3823881
10	2-1	Pasaje Tacna	Tacna	2024-09-24 01:01:25	-33.051473	-71.3686783
11	2-1	Pasaje Granizo	Ramayana	2024-09-24 01:02:07	-33.0624463	-71.3845345
12	2-1	Bilbao	Paul Harris	2024-09-24 01:04:27	-33.0645217	-71.3618842
13	1-1	Colmar	Pasaje Strasbourg	2024-09-24 01:05:15	-33.0683565	-71.3680043
14	3-2	Avenida Las Palmas	Los Anacardos	2024-09-24 13:13:34	-33.0575436	-71.3464492
15	1-1	Calle Villa Esmeralda	María Mercedes	2024-09-24 23:40:48	-33.0639012	-71.3818206
16	2-1	Pasaje Río Valdivia 3	Pasaje Río Valdivia 1	2024-09-25 00:24:28	-33.0431282	-71.3493433
17	1-1	Bilbao	Pasaje Bilbao	2024-09-25 00:27:57	-33.0645399	-71.3627146
18	1-2	Pedro Montt	Pasaje Mundaca	2024-09-25 10:44:36	-33.0474315	-71.3614832
19	2-1	Bilbao	Ignacio Carrera Pinto	2024-09-25 10:57:26	-33.0646437	-71.3643767
20	2-1	Bilbao	Ignacio Carrera Pinto	2024-09-25 11:00:52	-33.0646437	-71.3643767
21	1-1	Fernanda	Marga Marga	2024-09-25 11:01:18	-33.0645146	-71.3710952
22	2-3	Santa Teresa de Jesús de Los Andes	Camino Troncal	2024-09-28 18:17:45	-33.0514944	-71.3399014
23	4-1	Bilbao	Marcelino Champagnat	2024-09-28 18:56:52	-33.0645495	-71.3631444
24	6-1	Pasaje Seis	Pasaje Cinco	2024-09-28 19:38:02	-33.0633382	-71.3588591
25	6-1	Pedro Montt	Cien Águilas	2024-09-28 19:39:24	-33.0473945	-71.3605775
26	6-3	Pasaje Río Valdivia 3	Pasaje Río Valdivia	2024-09-28 19:42:25	-33.0430336	-71.3482573
27	3-1	Pasaje Las Cruces	Alcalde Miguel Gandulfo G.	2024-09-30 17:14:45	-33.0588079	-71.3933562
28	4-1	Bilbao	Pasaje Bilbao	2024-09-30 17:31:35	-33.0645399	-71.3627146
29	5-1	José Venturelli	Alcalde Alejandro Peralta	2024-09-30 17:45:17	-33.0592582	-71.3948601
30	1-3	Aranda	Santiago	2024-09-30 19:02:24	-33.0438012	-71.380718
31	3-2	Pasaje Granizo	Ramayana	2024-09-30 19:07:11	-33.0624463	-71.3845345
32	2-1	Pasaje Eugenio Grandi	El Bosque	2024-10-10 00:29:10	-33.0536011	-71.3819607
33	3-1	Jaime Eyzaguirre	Alberto Orrego Luco	2024-10-10 00:32:41	-33.0493919	-71.3930763
34	4-1	Rafael Fabres	Los Naranjos	2024-10-10 00:35:45	-33.0390699	-71.3996807
35	6-1	Los Dominicos	Buen Pastor	2024-10-10 00:45:19	-33.053158	-71.3357902
36	2-1	Tucapel	Colo Colo	2024-10-10 00:57:17	-33.0390928	-71.3454645
37	3-1	Proa	La Paz	2024-10-11 09:12:20	-33.0356469	-71.3711201
38	3-1	Lima	Progreso	2024-10-11 09:14:38	-33.0360504	-71.3753696
39	6-1	Villar	Arrieta	2024-10-11 09:22:07	-33.0502452	-71.3769675
40	6-4	Pasaje Granizo	Las Piedras	2024-10-11 11:26:07	-33.06245	-71.3835087
41	3-3	Fernanda	Pasaje Santa Rosa	2024-10-11 11:52:51	-33.0645146	-71.3710952
42	4-2	Bilbao	Pasaje Bilbao	2024-10-11 11:57:37	-33.0645399	-71.3627146
43	5-1	Bilbao	Ignacio Carrera Pinto	2024-10-11 11:58:57	-33.0646437	-71.3643767
44	4-1	Pasaje Las Cruces	Alcalde Miguel Gandulfo G.	2024-10-11 12:03:06	-33.0588079	-71.3933562
45	2-1	Bilbao	Paul Harris	2024-10-11 12:11:12	-33.0645217	-71.3618842
46	3-1	Dalias	Avenida Las Américas	2024-10-11 12:12:46	-33.0416171	-71.3947455
47	1-1	Pasaje Tacna	Tacna	2024-10-11 12:19:31	-33.051473	-71.3686783
48	1-1	Pasaje Las Cruces	Alcalde Miguel Gandulfo G.	2024-10-11 12:19:45	-33.0588079	-71.3933562
49	4-1	Bilbao	Marcelino Champagnat	2024-10-11 12:22:10	-33.0645495	-71.3631444
50	4-1	Pasaje Las Cruces	Alcalde Miguel Gandulfo G.	2024-10-11 12:22:43	-33.0588079	-71.3933562
51	2-1	San Lorenzo	Arturo Prat	2024-10-11 12:23:05	-33.0410806	-71.3703697
52	1-2	Olmué	Limache	2024-10-11 12:24:44	-33.062058	-71.3865816
53	4-3	Bilbao	Paul Harris	2024-10-11 12:37:08	-33.0645217	-71.3618842
54	2-1	Pasaje Granizo	Jarilla	2024-10-11 12:50:14	-33.0624713	-71.3823881
55	3-1	Pasaje Granizo	Jarilla	2024-10-11 12:55:54	-33.0624713	-71.3823881
56	4-3	Pasaje Granizo	Las Piedras	2024-10-11 12:56:42	-33.06245	-71.3835087
57	3-1	Jesuitas	Los Pasionistas	2024-10-11 12:56:56	-33.052378	-71.3361149
58	5-1	San Lorenzo	Arturo Prat	2024-10-11 13:11:26	-33.0410806	-71.3703697
59	4-1	Haydn	Beethoven	2024-10-11 13:12:46	-33.0647185	-71.398622
60	3-1	Bilbao	Paul Harris	2024-10-11 13:13:01	-33.0645217	-71.3618842
61	4-1	Sevillana	Porvenir	2024-10-11 13:14:39	-33.0479902	-71.3927166
62	4-1	Sevillana	Porvenir	2024-10-11 13:15:42	-33.0479902	-71.3927166
63	2-1	Raúl González	Portofino	2024-10-11 16:23:00	-33.0339531	-71.3971344
64	3-2	Bilbao	Ignacio Carrera Pinto	2024-10-11 16:25:24	-33.0646437	-71.3643767
65	1-1	Pasaje Las Cruces	Alcalde Miguel Gandulfo G.	2024-10-11 16:25:54	-33.0588079	-71.3933562
66	5-1	Rodríguez	Los Fresnos	2024-10-11 16:27:01	-33.0376455	-71.3479579
67	6-3	Parroquia	Freire	2024-10-11 16:28:04	-33.043478	-71.351327
68	1-1	Bilbao	Paul Harris	2024-10-11 16:29:09	-33.0645217	-71.3618842
69	4-1	Bilbao	Pasaje Bilbao	2024-10-11 16:30:12	-33.0645399	-71.3627146
70	2-1	Sevillana	Porvenir	2024-10-12 17:30:25	-33.0479902	-71.3927166
71	4-1	Togo	Tokio	2024-10-12 17:46:26	-33.0411628	-71.3659796
72	3-1	Villar	Lastra	2024-10-12 17:48:35	-33.0502452	-71.3769675
73	6-1	Sevillana	Porvenir	2024-10-12 18:21:36	-33.0479902	-71.3927166
74	4-2	Olmué	Lliu Lliu	2024-10-12 18:22:08	-33.0637222	-71.3866204
\.


--
-- Data for Name: estado_bomberos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_bomberos (hora, id_emergencia, id_bombero) FROM stdin;
\.


--
-- Data for Name: estado_carros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_carros (id_estadocarro, x, y, estado, bomberos, fecha, cargo, id_carro, id_accion) FROM stdin;
1	-33.0485097	-71.3771123	0	\N	2024-09-28 18:35:44	\N	1	\N
2	-33.0485097	-71.3771123	0	\N	2024-09-28 18:35:44	\N	2	\N
3	-33.0485097	-71.3771123	0	\N	2024-09-28 18:35:44	\N	3	\N
4	-33.0485097	-71.3771123	0	\N	2024-09-28 18:35:44	\N	4	\N
5	-33.0435523	-71.3722742	0	\N	2024-09-28 18:35:44	\N	5	\N
6	-33.0435523	-71.3722742	0	\N	2024-09-28 18:35:44	\N	6	\N
7	-33.0435523	-71.3722742	0	\N	2024-09-28 18:35:44	\N	6	\N
8	-33.0435523	-71.3722742	0	\N	2024-09-28 18:35:44	\N	6	\N
9	-33.0485097	-71.3771123	0	\N	2024-09-28 18:37:51	\N	1	\N
10	-33.0485097	-71.3771123	0	\N	2024-09-28 18:37:51	\N	2	\N
11	-33.0485097	-71.3771123	0	\N	2024-09-28 18:37:51	\N	3	\N
12	-33.0485097	-71.3771123	0	\N	2024-09-28 18:37:51	\N	4	\N
13	-33.0435523	-71.3722742	0	\N	2024-09-28 18:37:51	\N	5	\N
14	-33.0435523	-71.3722742	0	\N	2024-09-28 18:37:51	\N	6	\N
15	-33.0466061	-71.3533567	0	\N	2024-09-28 18:37:51	\N	7	\N
16	-33.0466061	-71.3533567	0	\N	2024-09-28 18:37:51	\N	8	\N
17	-33.0466061	-71.3533567	0	\N	2024-09-28 18:37:51	\N	9	\N
18	-33.0562161	-71.3912396	0	\N	2024-09-28 18:37:51	\N	10	\N
19	-33.0562161	-71.3912396	0	\N	2024-09-28 18:37:51	\N	11	\N
20	-33.0562161	-71.3912396	0	\N	2024-09-28 18:37:51	\N	12	\N
21	-33.0473945	-71.3605775	1	3	2024-09-28 19:39:37	5	9	33
22	-33.0588079	-71.3933562	1	5	2024-09-30 17:15:08	23	5	35
23	-33.0438012	-71.380718	1	5	2024-09-30 19:02:45	190	3	42
24	-33.0438012	-71.380718	1	1	2024-09-30 19:02:56	123	11	42
25	-33.0438012	-71.380718	1	4	2024-09-30 19:03:11	163	5	42
26	-33.0438012	-71.380718	1	1	2024-09-30 19:03:34	188	7	42
27	-33.0624463	-71.3845345	1	5	2024-09-30 19:07:42	20	10	44
28	-33.0624463	-71.3845345	1	2	2024-09-30 19:07:43	190	3	44
29	-33.0502452	-71.3769675	1	4	2024-10-12 18:13:38	43	1	113
30	-33.0479902	-71.3927166	1	3	2024-10-12 18:21:46	7	4	114
31	-33.0637222	-71.3866204	1	3	2024-10-12 18:22:22	4	6	116
32	-33.0637222	-71.3866204	1	1	2024-10-12 18:22:39	3	2	116
\.


--
-- Data for Name: estado_victimas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_victimas (triage, lugar, hora, institucion, id_victima, id_emergencia) FROM stdin;
\.


--
-- Data for Name: victimas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.victimas (id_victima, nombre, apellido_p, apellido_m, edad, sexo) FROM stdin;
\.


--
-- Name: acciones_id_accion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.acciones_id_accion_seq', 116, true);


--
-- Name: bomberos_id_bombero_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bomberos_id_bombero_seq', 302, true);


--
-- Name: carros_id_carro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carros_id_carro_seq', 12, true);


--
-- Name: emergencias_id_emergencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergencias_id_emergencia_seq', 74, true);


--
-- Name: estado_carros_id_estadocarro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_carros_id_estadocarro_seq', 32, true);


--
-- Name: victimas_id_victima_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.victimas_id_victima_seq', 1, false);


--
-- Name: acciones acciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT acciones_pkey PRIMARY KEY (id_accion);


--
-- Name: bomberos bomberos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bomberos
    ADD CONSTRAINT bomberos_pkey PRIMARY KEY (id_bombero);


--
-- Name: carros carros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carros
    ADD CONSTRAINT carros_pkey PRIMARY KEY (id_carro);


--
-- Name: emergencias emergencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencias
    ADD CONSTRAINT emergencias_pkey PRIMARY KEY (id_emergencia);


--
-- Name: estado_carros estado_carros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_carros
    ADD CONSTRAINT estado_carros_pkey PRIMARY KEY (id_estadocarro);


--
-- Name: victimas victimas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.victimas
    ADD CONSTRAINT victimas_pkey PRIMARY KEY (id_victima);


--
-- Name: estado_carros fk_accion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_carros
    ADD CONSTRAINT fk_accion FOREIGN KEY (id_accion) REFERENCES public.acciones(id_accion);


--
-- Name: acciones fk_bombero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT fk_bombero FOREIGN KEY (id_bombero) REFERENCES public.bomberos(id_bombero);


--
-- Name: estado_bomberos fk_bombero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_bomberos
    ADD CONSTRAINT fk_bombero FOREIGN KEY (id_bombero) REFERENCES public.bomberos(id_bombero);


--
-- Name: estado_carros fk_cargo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_carros
    ADD CONSTRAINT fk_cargo FOREIGN KEY (cargo) REFERENCES public.bomberos(id_bombero);


--
-- Name: acciones fk_carro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT fk_carro FOREIGN KEY (id_carro) REFERENCES public.carros(id_carro);


--
-- Name: estado_carros fk_carro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_carros
    ADD CONSTRAINT fk_carro FOREIGN KEY (id_carro) REFERENCES public.carros(id_carro);


--
-- Name: estado_victimas fk_emergencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_victimas
    ADD CONSTRAINT fk_emergencia FOREIGN KEY (id_emergencia) REFERENCES public.emergencias(id_emergencia);


--
-- Name: acciones fk_emergencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones
    ADD CONSTRAINT fk_emergencia FOREIGN KEY (id_emergencia) REFERENCES public.emergencias(id_emergencia);


--
-- Name: estado_bomberos fk_emergencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_bomberos
    ADD CONSTRAINT fk_emergencia FOREIGN KEY (id_emergencia) REFERENCES public.emergencias(id_emergencia);


--
-- Name: estado_victimas fk_victima; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_victimas
    ADD CONSTRAINT fk_victima FOREIGN KEY (id_victima) REFERENCES public.victimas(id_victima);


--
-- PostgreSQL database dump complete
--

