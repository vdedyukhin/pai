/*
 * Copyright (c) Microsoft Corporation
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react';
import {isNil} from 'lodash';
import PropTypes from 'prop-types';
import {Pivot, PivotItem, Icon, ActionButton, Stack, getTheme} from 'office-ui-fabric-react';
import {getFormClassNames, getTabFromStyle} from './form-style';
import {TabFormContent} from './tab-form-content';
import Card from '../../components/card';

const TAB_ITEM_KEY_PREFIX = 'tabItem-';
const tabFormStyle = getTabFromStyle();

export class TabForm extends React.Component {
  constructor(props) {
    super(props);
    const {items} = props;

    let selectedIndex;
    if (items !== undefined && items.size !== 0) {
      selectedIndex = 0;
    }

    this.state = {
      selectedIndex: selectedIndex,
    };
  }

  _getItemKeyByIndex(index) {
    return TAB_ITEM_KEY_PREFIX + index;
  }

  _getItemIndexByKey(key) {
    return Number(key.substring(TAB_ITEM_KEY_PREFIX.length));
  }

  _renderPivotItems(items) {
    const pivotItems = items.map((items) =>
                         <PivotItem key={items.itemKey}
                                    itemKey={items.itemKey}
                                    headerText={items.headerText}
                                    onRenderItemLink={this._onRenderItem.bind(this)}/>);

    return pivotItems;
  }

  _onRenderItem(itemPros, defaultRender) {
    if (itemPros === undefined || defaultRender === undefined) {
      return null;
    }

    return (
    <span>
      { defaultRender(itemPros) }
      <Icon iconName="Cancel"
            styles={ tabFormStyle.tabIcon }
            onClick={this._onItemDelete.bind(this, itemPros.itemKey)} />
    </span>);
  }

  _onItemsChange(updatedItems) {
    const {onItemsChange} = this.props;
    if (onItemsChange !== undefined) {
      onItemsChange(updatedItems);
    }
  }

  _onItemDelete(itemKey, event) {
    event.stopPropagation();

    if (itemKey === undefined) {
      return;
    }

    const itemIndex = this._getItemIndexByKey(itemKey);
    const {items, onItemDelete} = this.props;
    if (onItemDelete === undefined) {
      return;
    }
    const newSelectedIndex = onItemDelete(items, itemIndex);
    this.setState({
      selectedIndex: newSelectedIndex,
    });
  }

  _onItemAdd() {
    const {items, onItemAdd} = this.props;
    if (onItemAdd === undefined) {
      return;
    }
    const newSelectedIndex = onItemAdd(items);
    this.setState({
      selectedIndex: newSelectedIndex,
    });
  }

  _onLinkClick(item) {
    this.setState({
      selectedIndex: this._getItemIndexByKey(item.props.itemKey),
    });
  }

  _onContentChange(index, itemContent) {
    const {items} = this.props;
    const updatedItems = [...items];
    updatedItems[index].content = itemContent;

    this._onItemsChange(updatedItems);
  }

  render() {
    let {selectedIndex} = this.state;
    const {items, advanceFlag} = this.props;

    const {formTabBar} = getFormClassNames();

    if ((selectedIndex === undefined && items.length) ||
        (selectedIndex > items.length - 1)) {
      selectedIndex = 0;
    }

    const {spacing} = getTheme();

    return (
      <div>
        <Stack className={formTabBar} horizontal>
          <Stack.Item styles={tabFormStyle.tabWapper}>
            <Pivot
              onLinkClick={this._onLinkClick.bind(this)}
              styles={{
                text: tabFormStyle.tab.text,
                root: tabFormStyle.tab.root,
                link: [{margin: 0, padding: `0 ${spacing.l1}`}],
                linkIsSelected: [{margin: 0, padding: `0 ${spacing.l1}`}],
              }}
              selectedKey={this._getItemKeyByIndex(selectedIndex)}
            >
            {items.map((item, idx) => (
              <PivotItem
                key={this._getItemKeyByIndex(idx)}
                itemKey={this._getItemKeyByIndex(idx)}
                headerText={item.headerText}
                onRenderItemLink={this._onRenderItem.bind(this)}
              />
            ))}
            </Pivot>
          </Stack.Item>
          <Stack.Item disableShrink>
            <ActionButton
              styles={{root: {padding: `0 ${spacing.l1}`}}}
              iconProps={{iconName: 'CircleAddition'}}
              text='Add new task role'
              onClick={this._onItemAdd.bind(this)}
            />
          </Stack.Item>
        </Stack>
        <Stack>
          <Card style={{padding: `${spacing.l2} ${spacing.l1} ${spacing.l1}`}}>
            {!isNil(selectedIndex) && (
              <TabFormContent
                key={selectedIndex}
                jobTaskRole={items[selectedIndex].content}
                onContentChange={this._onContentChange.bind(this, selectedIndex)}
                advanceFlag={advanceFlag}
              />
            )}
          </Card>
        </Stack>
      </div>
    );
  }
}

TabForm.propTypes = {
  items: PropTypes.array.isRequired,
  onItemAdd: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  onItemsChange: PropTypes.func,
  advanceFlag: PropTypes.bool,
};
