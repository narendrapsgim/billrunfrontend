import React, { useState, useMemo, useCallback } from 'react';
import EntityList from '../EntityList';
import { ExporterPopup } from '@/components/Exporter';
import { getFieldName } from '@/common/Util';


const filterFields = [
  { id: 'description', placeholder: 'Title' },
  { id: 'key', placeholder: 'Key' },
];

const projectFields = {
  key: 1,
  description: 1,
  type: 1,
};

const parseType = (item) => item.get('type', '') === 'percentage'
  ? getFieldName('type_percentage', 'discount')
  : getFieldName('type_monetary', 'discount')


const tableFields = [
  { id: 'description', title: 'Title', sort: true },
  { id: 'key', title: 'Key', sort: true },
  { id: 'type', title: 'Type', sort: true, parser: parseType },
];

const actions = [
  { type: 'edit' },
];


const DiscountsList = () => {

  const [visibleExport, toggleExpoer] = useState(false);

  const showExport = useCallback(() => {
      toggleExpoer(true)
  }, [toggleExpoer]);

  const hideExport = useCallback(() => {
      toggleExpoer(false)
  }, [toggleExpoer]);

  const listActions = useMemo(() => ([{
    type: 'add',
  }, {
    type: 'refresh',
  }, {
    type: 'export_csv',
    label: 'Export',
    onClick: showExport,
    actionStyle: 'primary',
    actionSize: 'xsmall',
  }]), [showExport]);

  return (
    <>
      <EntityList
        entityKey="discount"
        filterFields={filterFields}
        tableFields={tableFields}
        projectFields={projectFields}
        actions={actions}
        listActions={listActions}
      />
      <ExporterPopup
        entityKey="discount"
        show={visibleExport}
        onClose={hideExport}
      />
    </>
  );
};

export default DiscountsList;
