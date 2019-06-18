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
import {KeyValueList} from './key-value-list';
import PropTypes from 'prop-types';
import {Port} from '../models/port';
import {BasicSection} from './basic-section';
import {FormShortSection} from './form-page';

export const PortsList = (props) => {
  const {onChange, ports} = props;

  const _onPortChange = (updatedPorts) => {
    if (onChange !== undefined) {
      onChange(updatedPorts);
    }
  };

  const _onPortAdd = (item) => {
    const port = new Port(item.itemKey, item.itemValue);
    const updatedPorts = [...ports, port];
    _onPortChange(updatedPorts);
  };

  const _onPortDelete = (index) => {
    const updatedPorts = ports.filter((_, itemIndex) => index !== itemIndex);
    _onPortChange(updatedPorts);
  };

  return (
    <BasicSection sectionLabel='Ports' sectionOptional>
      <FormShortSection>
        <KeyValueList items={ports.map((port) => {
          return {itemKey: port.portLabel, itemValue: port.portNumber};
        })}
        onItemAdd={_onPortAdd}
        onItemDelete={_onPortDelete}/>
      </FormShortSection>
    </BasicSection>
  );
};

PortsList.propTypes = {
  ports: PropTypes.arrayOf(PropTypes.instanceOf(Port)),
  onChange: PropTypes.func,
};