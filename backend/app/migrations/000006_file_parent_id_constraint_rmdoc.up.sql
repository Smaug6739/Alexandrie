alter table ressources
    drop foreign key ressources_documents_id_fk;

alter table ressources
    add constraint ressources_documents_id_fk
        foreign key (parent_id) references documents (id)
            on delete set null;

