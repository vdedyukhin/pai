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
import {TextField, DefaultButton, Stack, getId} from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import {DockerInfo} from '../models/docker-info';
import {BasicSection} from './basic-section';
import {FormShortSection} from './form-page';

export const DockerSection = (props) => {
  const {onValueChange, value} = props;
  const {uri} = value;
  const textFieldId = getId('textField');

  const _onChange = (keyName, value) => {
    const updatedDockerInfo = new DockerInfo(value);
    updatedDockerInfo[keyName] = value;
    if (onValueChange !== undefined) {
      onValueChange(updatedDockerInfo);
    }
  };

  return (
    <BasicSection sectionLabel={'Docker'}>
      <Stack horizontal gap='l1'>
        <FormShortSection>
          <TextField id={textFieldId}
                     placeholder='Enter docker uri...'
                     onBlur={(event) => _onChange('uri', event.target.value)}
                     value={uri}/>
         </FormShortSection>
        <DefaultButton>Auth</DefaultButton>
      </Stack>
    </BasicSection>
  );
};

DockerSection.propTypes = {
  value: PropTypes.instanceOf(DockerInfo).isRequired,
  onValueChange: PropTypes.func,
};