alter table "account" add column "issuer" text not null;

create unique index "account_issuer_accountId_uidx" on "account" ("issuer", "accountId");