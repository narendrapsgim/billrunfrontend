import * as Colors from 'material-ui/styles/colors';

const users_list_view = {
  title: "",
  view_type: "list",
  sections: [ {
    title: "",
    lists: [ {
      title: "Users",
      url: globalSetting.serverUrl + '/api/find?collection=users',
      fields: [
        { key: 'username', label: "Username" },
        { key: 'roles', label: "Roles" }
      ],
      controllers: {
        new: { label: "New" },
        delete: { label: "Delete", color: Colors.red500 }
      },
      onItemClick: 'edit'
    } ]
  } ]
};

const users_edit_view = {
  title: "Edit User",
  view_type: "sections",
  sections: [
    {
      fields: [
        { dbkey: "username", label: "Username" },
        { dbkey: "roles", label: "Roles", type: "array" }
      ]
    }
  ]
};

const users_new_view = {
  title: "New User",
  view_type: "sections",
  sections: [
    {
      fields: [
        { dbkey: "username", label: "Username" },
        { dbkey: "password", label: "Password" },
        { dbkey: "roles", label: "Roles" }
      ]
    }
  ]
};

let UsersView = {};
UsersView.users_list_view = users_list_view;
UsersView.users_edit_view = users_edit_view;
UsersView.users_new_view = users_new_view;
export default UsersView;
