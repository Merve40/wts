
        StudentTable.setSrcClass(this);
    var provider =  new DataProvider();
    this.result = provider.getData();
  }

  ngAfterViewInit(){
  }

  loadMore(event:any){
    console.log("loading..");
  }
}
=======
  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        for (var i = 0; i < json.length; i++) {
         }};
        break;
    }
  }
>>>>>>> Stashed changes

import { AccountTable } from '../../../../providers/api/account';
import { ContactRequestTable } from '../../../../providers/api/contactrequest';
import { StudentTable } from '../../../../providers/api/student';
    students = [];
        StudentTable.setSrcClass(this);
    var provider =  new DataProvider();
    this.result = provider.getData();
  }
    this.students = provider.getData();
    }

  ngAfterViewInit(){
  }
    onComplete(src, json) {
        switch (src) {
            case "contact-query":
                for (var i = 0; i < json.length; i++) {
                    if (json[i].body == null) {
                        break;
                    }
                    else {
                        var sender = json[i].body.sender;
                        var receiver = json[i].body.receiver;
                        var request = json[i].body.request;
                        if (request == true) {
                            this.StudentTable.getByValue("Account_Id", sender, "account-request", this.onComplete);
                            this.StudentTable.getByValue("Account_Id", receiver, "account-request", this.onComplete);
                        }
                    }
                };
                break;

            case "account-request":
                this.students.push(new User(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni));
                console.log(this.students);
                break;
        }
    }

    ngAfterViewInit() {
        console.log("test");
        this.storage.get("user_id").then((id) => this.searchForContacts(id));
    }

    searchForContacts(id) {
        this.ContactRequestTable.getAllContaining("reciever", id, "contact-query", this.onComplete);
        this.ContactRequestTable.getAllContaining("sender", id, "contact-query", this.onComplete);
    }


  loadMore(event:any){
    console.log("loading..");
  }
}
=======
  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        for (var i = 0; i < json.length; i++) {
         }};
        break;
    }
  }
>>>>>>> Stashed changes
