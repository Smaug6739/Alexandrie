alter table ressources
    add parent_id bigint UNSIGNED null after transformed_path;

alter table ressources
    add constraint ressources_documents_id_fk
        foreign key (parent_id) references documents (id);

