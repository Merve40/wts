import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular/platform/platform';

export enum NotificationEvent {

    MESSAGE_RECEIVED = "message",
    CONTACT_REQUESTED = "contact-request",
    CONTACT_ACCEPTED = "contact-accepted"

}

export function parseEvent(event: string): NotificationEvent {
    if (event == NotificationEvent.MESSAGE_RECEIVED.toString()) {
        return NotificationEvent.MESSAGE_RECEIVED;

    } else if (event == NotificationEvent.CONTACT_ACCEPTED.toString()) {
        return NotificationEvent.CONTACT_ACCEPTED;

    } else if (event == NotificationEvent.CONTACT_REQUESTED.toString()) {
        return NotificationEvent.CONTACT_REQUESTED;
    }
    return null;
}

@Injectable()
export class NotificationService {

    conversations = {};
    messages = 0;
    contactRequests = 0;
    newContacts = 0;
    subscriptions: Array<{ event: NotificationEvent, callback: any }> = new Array<{ event: NotificationEvent, callback: any }>();

    constructor(public storage: Storage, platform:Platform) {
        this.initialize();

        platform.pause.subscribe(()=>{
            this.persist();
        });
    }

    subscribe(event: NotificationEvent, callback) {

        var subscription = this.subscriptions.find(s => s.event == event && s.callback.toString() == callback.toString());
        if (!subscription) {
            this.subscriptions.push({ event, callback });
        }
    }

    unsubscribeAll() {
        this.subscriptions = new Array<{ event: NotificationEvent, callback: any }>();
    }

    notify(event: NotificationEvent, fromServer: boolean, data?: any) {

        if (event == NotificationEvent.MESSAGE_RECEIVED) {
            if (fromServer) {
                this.messages+=1;
                this.conversations[data.conversationId] = { message: data.message, timestamp: data.timestamp };
            } else {
                this.messages-=1;
                delete this.conversations[data];
            }

        } else if (event == NotificationEvent.CONTACT_REQUESTED) {
            if (fromServer) {
                this.contactRequests += 1;
            } else {
                this.contactRequests = 0;
            }

        } else if (event == NotificationEvent.CONTACT_ACCEPTED) {
            if (fromServer) {
                this.newContacts += 1;
            } else {
                this.newContacts = 0;
            }
        }

        var eventSubscriptions = this.subscriptions.filter(s => s.event == event);
        if (eventSubscriptions) {
            eventSubscriptions.forEach(subscription => subscription.callback(fromServer,data));
        }
    }

    initialize() {
        this.storage.get("conversations").then(conversations => {
            if (conversations) {
                this.conversations = conversations;
            }
            return this.storage.get("contact-requests");
        }).then(requests => {
            this.contactRequests = requests
            return this.storage.get("new-contacts");
        }).then(contacts => {
            this.newContacts = contacts;
            return this.storage.get("messages");
        }).then(messages => this.messages = messages);
    }

    persist() {
        this.storage.set("conversations", this.conversations).then((v) => {
            return this.storage.set("contact-requests", this.contactRequests);
        }).then((v) => {
            this.storage.set("new-contacts", this.newContacts);
            return this.storage.set("messages", this.messages);
        });
    }
}