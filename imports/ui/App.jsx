import React, {Component} from 'react'
import {withTracker} from 'meteor/react-meteor-data'
import {PropTypes} from 'prop-types'
import {Meteor} from 'meteor/meteor'

import {Messages} from '../api/messages.js'
import Message from './Message.jsx'
import Chat from './Chat.jsx'
import AccountModal from './AccountModal.jsx'
import MessageBox from './MessageBox.jsx'

/**
 * App controls all of the subclasses and main functionality.
 */
class App extends Component {
    /**
     * Constructor sets state
     * @param {Object} props - properties.
     */
    constructor(props) {
        super(props)

        this.getAccounts()

        this.state = {
            'accounts': {},
            'accountsList': [],
            'accountModal': true,
            'modalStates': {
                'LOADING': 'loading',
                'LIST': 'account-list',
                'UNLOCK': 'account-unlock',
                'NEW': 'account-new',
                'PUBKEY': 'message-pubkey',
            },
            'current': '',
            'messageid': 12,
            // 'currentModalState': 'account-list',
            'currentModalState': 'loading',
        }
    }

    /**
     * Get the accounts from web3
     */
    getAccounts() {
        try {
            Promise.resolve(web3.eth.getAccounts())
                .then((res) => {
                    console.log(`GOT ACCOUNTS ${res}`)
                    this.setState({
                        'accountsList': res,
                        'currentModalState': this.state.modalStates.LIST,
                    })
                })
        } catch (exception) {
            console.log(exception)
        }
    }

    /**
     * Updates the accounts list.
     * @param {Array} res - list of accounts
     */
    updateAccountList(res) {
        newAccounts = {}
        res.forEach((element) => {
            newAccounts[element] = ''
        })

        // TODO search the chain for the messages

        this.setState({
            'accounts': newAccounts,
            'accountModal': false,
        })
    }

    /**
     * Pull messages for the Chat
     * @param {String} addr - selected account address
     */
    handleSelectChat(addr) {
        if (this.state.current === addr) {
            return
        }
        let currentAccounts = this.state.accounts

        if (addr in currentAccounts) {
            currentAccounts[addr] = 'selected'
        }
        if (this.state.current in currentAccounts) {
            currentAccounts[this.state.current] = ''
        }

        this.setState({
            'accounts': currentAccounts,
            'current': addr,
        })
    }

    /**
     * Changes a modal state
     * @param {string} state - The state to set.
     */
    changeModalState(state) {
        this.setState({
            'currentModalState': state,
        })
    }
    /**
     * Toggles the new account modal
     */
    toggleNewAccount() {
        this.setState({
            'accountModal': !this.state.accountModal,
        })
    }

    /**
     * Renders the new account modal and background.
     * @return {html} - rendered modal html.
     */
    renderAccountModal() {
        if (this.state.accountModal) {
            return (
                <div>
                    <div id="fadedbg"
                        onClick={this.toggleNewAccount.bind(this)}>
                    </div>
                    <div className="account-modal">
                        <AccountModal
                            accountsLists={this.state.accountsList}
                            onAccountUpdates={this.updateAccountList.bind(this)}
                            handleModalClose={this.toggleNewAccount.bind(this)}
                            changeModalState={this.changeModalState.bind(this)}
                            currentAccounts={Object.keys(this.state.accounts)}
                            states={this.state.modalStates}
                            currentState={this.state.currentModalState}
                        />
                    </div>
                </div>
            )
        }
    }

    /**
     * Handle the submission of the message.
     * Send to Contract
     * @param {String} to  - recipient of message
     * @param {String} message - content of message
     * @param {Boolean} encrypt - Boolean to encrypt
     */
    handleSubmitMessage(to, message, encrypt) {
        if (this.state.current === '') {
            alert('No account selected')
            return
        }

        console.log(`[APP] handleSubmitMessage 
            ${this.state.messageid} =
            ${to},
            ${message},
            ${encrypt}`
        )

        // Use this state only if pubkey not found

        this.setState({
            'currentModalState': this.state.modalStates.PUBKEY,
        })
        this.toggleNewAccount()

        // COMMENTED FOR TESTING

        // this.props.messages.push({
        //     '_id': this.state.messageid,
        //     'to': to,
        //     'from': this.state.current,
        //     'message': message,
        //     'sending': 'sending',
        // })

        // this.setState({'messageid': this.state.messageid + 1})
        // this.messageSubmitBox.clearBox()

        // Example sending state

        // setTimeout(() => {
        //     let msgs = this.props.messages
        //     this.props.messages[msgs.length - 1].sending = 'sending-done'
        //     this.forceUpdate()
        // }, 4000)
    }

    /**
     * Renders the box to submit message
     * @return {html} rendered html
     */
    renderSubmitBox() {
        return (
            <MessageBox onSubmitMessage={this.handleSubmitMessage.bind(this)}
                ref={(instance) => {
                    this.messageSubmitBox = instance
                }} />
        )
    }

    /**
     * Render the messages for this user
     * @return {html} list of messages for this user.
     */
    renderMessages() {
        if (this.state.current === '') {
            return
        }

        return this.props.messages.filter((msg) =>
            (msg.to.toLowerCase() === this.state.current.toLowerCase()
                || msg.from.toLowerCase() === this.state.current.toLowerCase()
            )).map((msg) => {
            return (
                <Message
                    key={msg._id}
                    message={msg}
                    currentUser={this.state.current}
                />
            )
        })
    }

    /**
     * Render the sidebar of chats/accounts
     * @return {html} list of accounts
     */
    renderChats() {
        return Object.keys(this.state.accounts).map((addr, index) => {
            selected = this.state.accounts[addr]
            return (
                <Chat
                    key={addr}
                    chat={addr}
                    selected={selected}
                    onChangeState={this.handleSelectChat.bind(this)}
                />
            )
        })
    }

    /**
     * Render the main HTML
     * @return {html} rendered html
     */
    render() {
        return (
            <div className="main-container">
                {this.renderAccountModal()}
                <div className="dapp-flex-content">
                    <div className="dapp-aside">
                        {this.renderChats()}
                        <div className="newAccountChat"
                            onClick={this.toggleNewAccount.bind(this)}>
                            <div className="oplus"></div>
                        </div>
                    </div>
                    <div id="messages-content">
                        <div className="messages">
                            {this.renderMessages()}
                        </div>
                        {this.renderSubmitBox()}
                    </div>
                </div>
            </div>
        )
    }
}

App.propTypes = {
    'messages': PropTypes.array.isRequired,
}

export default withTracker(() => {
    Meteor.subscribe('messages')
    return {
        'messages': [
            {
                '_id': 0,
                'to': '0x53b13c1e9d5e14669d6fecc3214c02cc41405df6',
                'from': '0xfe905B1F5fC8A3DEFc4734f0086D4E70c4c2d313',
                'message': 'hello',
                'sending': '',
            },
            {
                '_id': 1,
                'to': '0x53b13c1e9d5e14669d6fecc3214c02cc41405df6',
                'from': '0xfe905B1F5fC8A3DEFc4734f0086D4E70c4c2d313',
                'message': 'this is an incredibly long message that needs to'
                + 'get broken up into a number of different things, yet'
                + 'another thing to consider being a frontend potato',
                'sending': '',
            },
            {
                '_id': 2,
                'to': '0x53b13c1e9d5e14669d6fecc3214c02cc41405df6',
                'from': '0xfe905B1F5fC8A3DEFc4734f0086D4E70c4c2d313',
                'message': 'lkasjdlkafdaidsaid lkasdj' +
                    'lajddslkajslkdajsldkjsaldkjalksjdlkajdslakjdslasdjlasdjl',
                'sending': '',
            },
        ],
    }
})(App)
