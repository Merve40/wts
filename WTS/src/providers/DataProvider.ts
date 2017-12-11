import { Component, ViewChild, Injectable } from '@angular/core';
import { AccountTable } from '../providers/api/account';
import { ContactRequestTable } from '../providers/api/contactrequest';
import { StudentTable } from '../providers/api/student';
import { CompanyTable } from '../providers/api/company';
import { UniversityTable } from '../providers/api/university';
import { OnResultComplete } from '../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';

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

    constructor(public storage: Storage, public ContactRequestTable: ContactRequestTable,
        public StudentTable: StudentTable, public UniversityTable: UniversityTable, public CompanyTable: CompanyTable) {

        ContactRequestTable.setSrcClass(this);
        StudentTable.setSrcClass(this);
        UniversityTable.setSrcClass(this);
        CompanyTable.setSrcClass(this);
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
                    reject();
                }
                var promises: Promise<User>[] = [];
                //retrieves a promise for each retrieval and pushes it onto the promises
                for (var i = 0; i < json.length; i++) {
                    var userId;
                    if (contacter == Contacter.RECEIVER) {
                        userId = json[i].body.sender;
                    } else {
                        userId = json[i].body.receiver;
                    }
                    promises.push(this.getNewUser(userId));
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
    public getNewUser(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.StudentTable.getUserTypeByAccountId(id, "", (src, json) => {
                var user;
                if (json.type == "gruppe_1") {
                    user = new User(id, json.body.Name + " " + json.body.Nachname, json.body.Uni);
                    user.usergroup = "group_1";
                    resolve(user);

                } else if (json.type == "gruppe_2") {
                    user = new User(id, json.body.Unternehmen, json.body.Branche);
                    user.usergroup = "group_2";
                    resolve(user);

                } else if (json.type == "gruppe_3") {
                    user = new User(id, json.body.Universität, json.body.Fachrichtungen);
                    user.usergroup = "group_3";
                    resolve(user);

                } else {
                    reject();
                }
            })
        });
    }
}

class User {
    id: string;
    name: string;
    description: string;
    usergroup: string;
    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}