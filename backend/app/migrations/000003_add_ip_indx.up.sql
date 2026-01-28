create index city_ipv4_complete_start_last_idx
    on city_ipv4_complete (network_start_integer, network_last_integer);

create index city_ipv4_complete_start_last_idx_v6
		on city_ipv6_complete (network_start_integer, network_last_integer);