import { Injectable } from '@angular/core';
import { ContactRequestTable } from '../providers/api/contactrequest';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

export enum UserGroup {
    STUDENT = 'group_1',
    COMPANY = 'group_2',
    UNIVERSITY = 'group_3',
    ALL = 'all'
}

enum Contacter {
    SENDER = 'sender',
    RECEIVER = 'receiver'
}

/**
 * Service Class for getting Contacts within the Network
 */
@Injectable()
export class DataProvider {

    constructor(public storage: Storage, public ContactRequestTable: ContactRequestTable) {
        ContactRequestTable.setSrcClass(this);
        console.log("contructing DataProvider");
    }

    /**
     * Retrieves users by the provided user-group.
     * User-group can be: ALL, STUDENT, COMPANY or UNIVERSITY
     * 
     * @param group UserGroup
     * @returns a promise containing a list of users
     */
    public getUsersByGroup(group: UserGroup): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.storage.get('user_id').then(id => {
                var array: User[] = [];
                this.getByUsergroup(id, group, Contacter.SENDER).then((users) => {
                    array = users;
                    return this.getByUsergroup(id, group, Contacter.RECEIVER);
                }).then((users) => {
                    var arr = array.concat(users);
                    resolve(arr);
                });
            });
        });
    }

    /**
     * Retrieves contacts filtered by 'sender' or 'receiver'.
     * 
     * @param id ID of the current user
     * @param group UserGroup
     * @param contacter 'receiver' or 'sender'
     */
    private getByUsergroup(id, group: UserGroup, contacter: Contacter): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            var array: User[] = [];
            this.ContactRequestTable.filterByValue(contacter, id, "", (src, json) => {
                //promise gets rejected if data is empty
                if (json[0].body == null) {
                    return;
                }
                var promises: Promise<User>[] = [];
                //retrieves a promise for each retrieval and pushes it onto the promises
                for (var i = 0; i < json.length; i++) {
                    if (json[i] && json[i].body) {
                        var userId;
                        if (contacter == Contacter.RECEIVER) {
                            userId = json[i].body.sender;
                        } else {
                            userId = json[i].body.receiver;
                        }
                        promises.push(this.getNewUser(userId, json[i].body.Zeitstempel));
                    }
                }
                //combines all promises and iterates over it
                //once the iteration is done, the array is returned by the resolve() callback
                Promise.all(promises).then((users) => {
                    users.forEach(user => {
                        if (group == 'all') {
                            array.push(user);
                        } else if (user.usergroup == group) {
                            array.push(user);
                        }
                    });
                    resolve(array);
                });
            });
        });
    }

    /**
     * Retrieves a user to add to the list and wraps it into a Promis
     * 
     * @param id ID of the new user to retrieve
     * @returns Promise containing the new user 
     */
    public getNewUser(id: string, timestamp: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.ContactRequestTable.getUserTypeByAccountId(id, "", (src, json) => {
                if(json.body == null){
                    return;
                }
                var user;
                if (json.type == "gruppe_1") {
                    user = new User(id, json.body.Name + " " + json.body.Nachname, json.body.Uni);
                    user.usergroup = "group_1";
                    user.timestamp = this.convertToDate(timestamp);
                    resolve(user);

                } else if (json.type == "gruppe_2") {
                    user = new User(id, json.body.Unternehmen, json.body.Branche);
                    user.usergroup = "group_2";
                    user.timestamp = this.convertToDate(timestamp);
                    resolve(user);

                } else if (json.type == "gruppe_3") {
                    user = new User(id, json.body.Universität, json.body.Fachrichtungen);
                    user.usergroup = "group_3";
                    user.timestamp = this.convertToDate(timestamp);
                    resolve(user);

                } else {
                    reject();
                }
            })
        });
    }

    private convertToDate(timestamp: string): string {
        var longFormat = +timestamp;
        return moment(longFormat).format("DD.MM.YYYY");
    }
}

class User {
    id: string;
    name: string;
    description: string;
    usergroup: string;
    timestamp: string;
    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}