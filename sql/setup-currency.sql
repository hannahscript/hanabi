create table if not exists wallets (
    user_id varchar(100) primary key,
    balance unsigned big int not null
);

create table if not exists transactions (
    origin_account varchar(100),
    target_account varchar(100),
    amount unsigned big int not null,
    transferred_at datetime not null
);
