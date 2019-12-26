import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react'

/* Tutorial Reference*/
/* https://reactgo.com/semantic-ui-react/ */
function NavigationBar() {
    return (
        <Menu fixed='top' pointing>
            <Menu.Item  name='home' href="/"/>
            <Menu.Item  name='new' href="/study/new"/>
            <Menu.Item  name='studies' href="/study/list"/>
            <Menu.Item  name='contact' href="/contact"/>
        </Menu>
    )
}

export default NavigationBar;