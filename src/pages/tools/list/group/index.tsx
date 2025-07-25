import { Box } from '@mui/material';
import React, { useState } from 'react';
import ToolTextInput from '@components/input/ToolTextInput';
import ToolTextResult from '@components/result/ToolTextResult';
import { groupList, SplitOperatorType } from './service';
import SimpleRadio from '@components/options/SimpleRadio';
import TextFieldWithDesc from '@components/options/TextFieldWithDesc';
import CheckboxWithDesc from '@components/options/CheckboxWithDesc';
import { formatNumber } from '../../../../utils/number';
import ToolContent from '@components/ToolContent';
import { ToolComponentProps } from '@tools/defineTool';
import { useTranslation } from 'react-i18next';

const initialValues = {
  splitOperatorType: 'symbol' as SplitOperatorType,
  splitSeparator: ',',
  groupNumber: 2,
  itemSeparator: ',',
  leftWrap: '[',
  rightWrap: ']',
  groupSeparator: '\\n',
  deleteEmptyItems: true,
  padNonFullGroup: false,
  paddingChar: '...'
};
const splitOperators: {
  title: string;
  description: string;
  type: SplitOperatorType;
}[] = [
  {
    title: 'Use a Symbol for Splitting',
    description: 'Delimit input list items with a character.',
    type: 'symbol'
  },
  {
    title: 'Use a Regex for Splitting',
    type: 'regex',
    description: 'Delimit input list items with a regular expression.'
  }
];

export default function FindUnique({ title }: ToolComponentProps) {
  const { t } = useTranslation('list');
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const compute = (optionsValues: typeof initialValues, input: any) => {
    const {
      splitOperatorType,
      splitSeparator,
      groupNumber,
      itemSeparator,
      leftWrap,
      rightWrap,
      groupSeparator,
      deleteEmptyItems,
      padNonFullGroup,
      paddingChar
    } = optionsValues;

    setResult(
      groupList(
        splitOperatorType,
        splitSeparator,
        input,
        groupNumber,
        itemSeparator,
        leftWrap,
        rightWrap,
        groupSeparator,
        deleteEmptyItems,
        padNonFullGroup,
        paddingChar
      )
    );
  };

  return (
    <ToolContent
      title={title}
      input={input}
      inputComponent={
        <ToolTextInput
          title={t('group.inputTitle')}
          value={input}
          onChange={setInput}
        />
      }
      resultComponent={
        <ToolTextResult title={t('group.resultTitle')} value={result} />
      }
      initialValues={initialValues}
      getGroups={({ values, updateField }) => [
        {
          title: t('group.inputItemSeparator'),
          component: (
            <Box>
              {splitOperators.map(({ title, description, type }) => (
                <SimpleRadio
                  key={type}
                  onClick={() => updateField('splitOperatorType', type)}
                  title={t(`group.splitOperators.${type}.title`)}
                  description={t(`group.splitOperators.${type}.description`)}
                  checked={values.splitOperatorType === type}
                />
              ))}
              <TextFieldWithDesc
                description={t('group.splitSeparatorDescription')}
                value={values.splitSeparator}
                onOwnChange={(val) => updateField('splitSeparator', val)}
              />
            </Box>
          )
        },
        {
          title: t('group.groupSizeAndSeparators'),
          component: (
            <Box>
              <TextFieldWithDesc
                value={values.groupNumber}
                description={t('group.groupNumberDescription')}
                type={'number'}
                onOwnChange={(value) =>
                  updateField('groupNumber', formatNumber(value, 1))
                }
              />
              <TextFieldWithDesc
                value={values.itemSeparator}
                description={t('group.itemSeparatorDescription')}
                onOwnChange={(value) => updateField('itemSeparator', value)}
              />
              <TextFieldWithDesc
                value={values.groupSeparator}
                description={t('group.groupSeparatorDescription')}
                onOwnChange={(value) => updateField('groupSeparator', value)}
              />
              <TextFieldWithDesc
                value={values.leftWrap}
                description={t('group.leftWrapDescription')}
                onOwnChange={(value) => updateField('leftWrap', value)}
              />
              <TextFieldWithDesc
                value={values.rightWrap}
                description={t('group.rightWrapDescription')}
                onOwnChange={(value) => updateField('rightWrap', value)}
              />
            </Box>
          )
        },
        {
          title: t('group.emptyItemsAndPadding'),
          component: (
            <Box>
              <CheckboxWithDesc
                title={t('group.deleteEmptyItems')}
                description={t('group.deleteEmptyItemsDescription')}
                checked={values.deleteEmptyItems}
                onChange={(value) => updateField('deleteEmptyItems', value)}
              />
              <CheckboxWithDesc
                title={t('group.padNonFullGroups')}
                description={t('group.padNonFullGroupsDescription')}
                checked={values.padNonFullGroup}
                onChange={(value) => updateField('padNonFullGroup', value)}
              />
              <TextFieldWithDesc
                value={values.paddingChar}
                description={t('group.paddingCharDescription')}
                onOwnChange={(value) => updateField('paddingChar', value)}
              />
            </Box>
          )
        }
      ]}
      compute={compute}
      setInput={setInput}
    />
  );
}
