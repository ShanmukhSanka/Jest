// columnMapper.js
import portalParamStore from './portalParamStore';

export const TEXT_FIELDS = ['aplctn_cd', 'S3_bkt_Key_cmbntn'];
export const DROPDOWN_FIELDS = ['clnt_id'];
export const MULTI_SELECT_FIELDS = ['domain_cd'];

export const getFieldType = (fieldName) => {
  if (TEXT_FIELDS.includes(fieldName)) return 'text';
  if (DROPDOWN_FIELDS.includes(fieldName)) return 'dropdown';
  if (MULTI_SELECT_FIELDS.includes(fieldName)) return 'multiselect';
  return 'text'; // default to text field
};

export const getFieldOptions = (fieldName) => {
  switch (fieldName) {
    case 'clnt_id':
      return portalParamStore.ownrshp_team;
    case 'domain_cd':
      return portalParamStore.prcsng_type;
    default:
      return [];
  }
};
