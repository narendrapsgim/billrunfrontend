import React from 'react';
import EntityList from '../EntityList';

const UserList = () => {
  const parseRoles = item => item.get('roles').join(', ');

  const fields = [
    { id: 'username', placeholder: 'User Name', sort: true },
    { id: 'roles', placeholder: 'Roles', parser: parseRoles },
  ];

  const projectFields = {
    username: 1,
    roles: 1,
  };

  const actions = [
    { type: 'edit' },
  ];

  return (
    <EntityList
      api="get"
      itemType="user"
      itemsType="users"
      filterFields={fields}
      tableFields={fields}
      projectFields={projectFields}
      actions={actions}
    />
  );
};

export default UserList;
