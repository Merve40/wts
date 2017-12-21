import { Injectable } from '@angular/core';
import { VisibilityTable } from './api/visibility';
import { ContactRequestTable } from './api/contactrequest';
import { BlockTable } from './api/block';

@Injectable()
export class VisibilityService {

    private myId: string;
    private usergroup: string;

    constructor(public contactReqTable: ContactRequestTable, public visibilityTable: VisibilityTable, public blockTable: BlockTable) {
    }

    /**
     * Initializes this service.
     * @param id current users id
     * @param group current users user-group
     */
    public initialize(id:string, group:string){
        this.myId = id;
        this.setUserGroup(group);
    }

    private setUserGroup(group: string) {
        if (group == "gruppe_1") {
            this.usergroup = "student";
        } else if (group == "gruppe_2") {
            this.usergroup = "company";
        } else if (group == "gruppe_3") {
            this.usergroup = "uni";
        }
    }

    /**
     * Loads all visibilities for the users profile.
     * 
     * @param userId id of the other user
     * @requires a promise containing a key-value pair for group (student, company or uni) and value (true or false)
     */
    public load(userId: string): Promise<{ key: string, value: boolean }[]> {

        return this.hasContact(userId).then(hasContact => {
            var prefix;
            if (hasContact) {
                prefix = "intern";
            } else {
                prefix = "extern";
            }
            return this.getBlocks(prefix);
        }).then(blocks => {
            return this.getVisibilities(userId, blocks);
        });
    }

    /**
     * Retrieves the visibility values of the other user.
     * 
     * @param userId id of the other user
     * @param blocks array of key-value pairs, containing block-id and block-name
     * @returns a promise containing an array of key-value pairs, which are group (student, company or uni) and value(true or false)
     */
    private getVisibilities(userId: string, blocks: { blockID: string, name: string }[]): Promise<{ key: string, value: boolean }[]> {

        var promise = new Promise<{ key: string, value: boolean }[]>((resolve, reject) => {
            var visibilities = [];

            this.visibilityTable.filterByValue("Account_Id", userId, "", (src, jsonArray) => {
                jsonArray.forEach(json => {

                    var blockID: string = json.body.Block_Id;
                    var block = blocks.find(b => b.blockID == blockID);

                    if (block) {
                        var keys = block.name.split("_"); //personal, address, email or study
                        visibilities.push({ key: keys[1], value: json.body.Sichtbar });
                    }
                });
                resolve(visibilities);
            })
        });

        return promise;
    }

    /**
     * Retrieves blocks starting with prefix 'intern_' or 'extern_' and 
     * ending with the curent user's usergroup.
     * 
     * @param prefix 'student' , 'company' or 'uni'
     * @returns promise containing a list of key-value pairs with block-id and block-name,
     */
    private getBlocks(prefix: string): Promise<{ blockID: string, name: string }[]> {
        var promise = new Promise<{ blockID: string, name: string }[]>((resolve, reject) => {
            this.blockTable.getAllStartingWith("Block_Name", prefix, "", (src, jsonArray) => {
                if (!jsonArray) return;
                var blocks = [];

                jsonArray.forEach(json => {
                    var block: string = json.body.Block_Name;
                    if (block.endsWith(this.usergroup)) {
                        blocks.push({ blockID: json.id, name: json.body.Block_Name });
                    }
                });
                resolve(blocks);
            });
        });

        return promise;
    }

    /**
     * Checks whether the current user and other user have contact.
     * @param userId id of the other user
     * @returns promise containing boolean, true if they have contact otherwise false
     */
    private hasContact(userId: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve, reject) => {
            this.contactReqTable.filterByValue("sender", this.myId, "", (src, jsonArray) => {
                var found: boolean = false;
                if (!jsonArray) return;

                jsonArray.forEach(json => {
                    if (json.body.receiver == userId && json.body.request === true) {
                        found = true;
                        resolve(found);
                        return;
                    }
                });
                if (!found) {
                    this.contactReqTable.filterByValue("receiver", this.myId, "", (src, jsArray) => {
                        jsArray.forEach(js => {
                            if (js.body.sender == userId && js.body.request === true) {
                                found = true;
                                resolve(found);
                                return;
                            }
                        });
                    });
                    resolve(found);
                }
            });
        });

        return promise;
    }


}