import * as functions from 'firebase-functions';
import { ON_CREATE_USERS_INDEXERS, ON_CREATE_SET_USER_BALANCE } from './users/users.functions';
import { ON_CREATE_PAYMENTS_INDEXERS, ON_DELETE_PAYMENTS_INDEXERS } from './payments/payments.functions';

export const onCreateUsersIndexers: functions.CloudFunction<functions.database.DataSnapshot> = ON_CREATE_USERS_INDEXERS;
export const onCreateSetUserBalance: functions.CloudFunction<functions.database.DataSnapshot> = ON_CREATE_SET_USER_BALANCE;

export const onCreatePaymentsIndexers: functions.CloudFunction<functions.database.DataSnapshot> = ON_CREATE_PAYMENTS_INDEXERS;
export const onDeletePaymentsIndexers: functions.CloudFunction<functions.database.DataSnapshot> = ON_DELETE_PAYMENTS_INDEXERS;
