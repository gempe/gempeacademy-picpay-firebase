import * as functions from 'firebase-functions';
import { database } from 'firebase-admin';

/**
 * Function para indexar os usuarios
 */
export const ON_CREATE_USERS_INDEXERS: functions.CloudFunction<functions.database.DataSnapshot> = functions.database
  .ref('users/usersList/{userId}')
  .onCreate(async (snapshot: functions.database.DataSnapshot) => {
    const totalUsers: database.Reference = await snapshot.ref.root.child('users/usersIndexers/totalUsers');

    totalUsers.transaction(users => {
      return users + 1;
    });
  });

/**
 * Function para setar o saldo do usuario
 */
export const ON_CREATE_SET_USER_BALANCE: functions.CloudFunction<functions.database.DataSnapshot> = functions.database
  .ref('users/usersList/{userId}')
  .onCreate(async (snapshot: functions.database.DataSnapshot, context: functions.EventContext) => {
    const userId: string = context.params.userId;

    const userBalanceInCents: database.Reference = await snapshot.ref.root.child(
      `users/usersList/${userId}/private/userCurrentBalanceInCents`
    );

    userBalanceInCents.transaction(balance => {
      return balance + 100000000;
    });
  });
