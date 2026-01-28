alter table documents
    add thumbnail TEXT null after pinned;

alter table documents
    add theme varchar(30) null after thumbnail;

alter table documents
    add icon TEXT null after thumbnail;

alter table documents
    add color int null after theme;

