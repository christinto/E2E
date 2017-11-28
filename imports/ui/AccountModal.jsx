import React, {Component} from 'react'

/**
 * The account modal that looks for the given
 * accounts.
 */
export default class AccountModal extends Component {

    /**
     * Handles the state initialization.
     * @param {Object} props - Properties passed to the modal
     */
    constructor(props) {
        super(props)
        this.state = {
            'selected': this.props.currentAccounts,
            'unlocked': [],
            'nextdisabled': true,
            'addAccount': {
                'Address': '',
                'PrivateKey': '',
            },
            'sendPubKey': '',
        }
    }

    /**
     * Handles the click event of the account.
     * @param {String} data - Address of account.
     * @param {Object} event - Event of click action.
     */
    handleClick(data, event) {
        let selectedSet = this.state.selected
        if (selectedSet.indexOf(data) === -1) {
            selectedSet.push(data)
            this.setState({'selected': selectedSet})
        } else {
            selectedSet.splice(selectedSet.indexOf(data), 1)
            this.setState({'selected': selectedSet})
        }

        if (selectedSet.length > 0) {
            this.setState({'nextdisabled': false})
        } else {
            this.setState({'nextdisabled': true})
        }
    }

    /**
     * Aciton handler for the `next button` click.
     * @param {Object} event - Click event
     */
    handleNext(event) {
        if (this.state.nextdisabled) {
            return
        }

        switch (this.props.currentState) {
        case this.props.states.LIST:
            this.props.changeModalState(this.props.states.UNLOCK)
            break
        case this.props.states.UNLOCK:
            this.props.onAccountUpdates(this.state.selected)
        }
    }

    /**
     * Handles the new account address field filled.
     * @param {Object} event - OnChange event of a new account.
     */
    handleAccountAddress(event) {
        // TODO search for key
        this.setState({
            'addAccount': {
                'Address': event.target.value,
                'PrivateKey': this.state.addAccount.PrivateKey,
            },
        })
    }

    /**
     * Handles the new account private key being filled.
     * @param {Object} event - OnChange event of privatekey.
     */
    handleAccountPrivateKey(event) {
        this.setState({
            'addAccount': {
                'Address': this.state.addAccount.Address,
                'PrivateKey': event.target.value,
            },
        })
    }

    /**
     * Handle the pressing of the public key
     * @param {Object} event - onChange event for Public Key
     */
    handlePubKeyChange(event) {
        this.setState({
            'sendPubKey': event.target.value,
        })
    }

    /**
     * Handle the public key OK button.
     * @param {Object} event - Submit button event.
     */
    handlePubkeySubmit(event) {
        // Send the message to the pubkey
        console.log('sending')
    }

    /**
     * Change to state
     * @param {string} state - The state to change to.
     */
    changeToState(state) {
        this.props.changeModalState(state)
    }


    /**
     * Toggles the modal close
     */
    toggleCloseModal() {
        this.props.handleModalClose()
    }

    /**
     *  Toggle the state to new account.
     * @param {Object} event - The click event.
     */
    toggleNewAccount(event) {
        switch (this.props.currentState) {
        case this.props.states.LIST:
            this.props.changeModalState(this.props.states.NEW)
            break
        case this.props.states.NEW:
            this.props.changeModalState(this.props.states.LIST)
            break
        }
    }

    /**
     * Render the html based on the state.
     * @return {html} - Rendered html.
     */
    render() {
        let selectedSet = this.state.selected
        let disabledState = true
        let closeButton = ''
        if (selectedSet > 0) {
            disabledState = false
        }

        switch (this.props.currentState) {
        case this.props.states.LOADING:
            return (
                <div>
                    <header>Loading Accounts</header>
                    <div className="spinner">
                        <div className="sk-folding-cube">
                            <div className="sk-cube1 sk-cube"></div>
                            <div className="sk-cube2 sk-cube"></div>
                            <div className="sk-cube4 sk-cube"></div>
                            <div className="sk-cube3 sk-cube"></div>
                        </div>
                    </div>
                </div>
            )
        case this.props.states.NEW:
            return (
                <div>
                    <header className="newaccount-header">
                        New Account
                        <div
                            className="go-back"
                            onClick={this.toggleNewAccount.bind(this)}>
                            <div className="backArrow"></div>
                        </div>
                        <div className="close-button"
                            onClick={this.toggleCloseModal.bind(this)}>X</div>
                    </header>
                    <ul className="new-account-form">
                        <li>
                            <div className="group">
                                <input
                                    type="text"
                                    value={this.state.addAccount.Address}
                                    onChange=
                                        {
                                            this.handleAccountAddress.bind(this)
                                        }
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label>Address</label>
                            </div>
                        </li>
                        <li>
                            <div className="group">
                                <input
                                    type="text"
                                    value={this.state.addAccount.PrivateKey}
                                    onChange=
                                        {
                                            this.handleAccountPrivateKey
                                                .bind(this)
                                        }
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label>PrivKey (to convert to pub)</label>
                            </div>
                        </li>
                        <li>
                            <button onClick={this.addNewAccountDone}>
                                Add
                            </button>
                        </li>
                    </ul>
                </div>
            )
        case this.props.states.LIST:
            console.log('STATE: LIST')
            return (
                <div>
                    <header>
                        Select Accounts
                        <div className="close-button"
                            onClick={this.toggleCloseModal.bind(this)}>X</div>
                    </header>
                    <ul className="accounts-list">
                        {
                            this.props.accountsLists.map((acc) => {
                                let cname = ''
                                if (selectedSet.indexOf(acc) != -1) {
                                    cname = 'toggled'
                                }
                                return (
                                    <li
                                        onClick=
                                            {this.handleClick.bind(this, acc)}
                                        className={cname}
                                        key={acc}>
                                        {acc}
                                    </li>
                                )
                            })
                        }
                        <li className="newAccount"
                            onClick={this.toggleNewAccount.bind(this)}>
                            <div className="oplus"></div>
                        </li>
                    </ul>
                    <button
                        type="submit"
                        onClick={this.handleNext.bind(this)}
                        disabled={this.state.nextdisabled}>
                        Next
                    </button>
                </div>
            )
        case this.props.states.UNLOCK:
            return (
                <div>
                    <header className='newaccount-header'>
                        Unlock Selected Accounts 
                        <div className="close-button"
                            onClick={this.toggleCloseModal.bind(this)}>X</div>
                        <div
                            className="go-back"
                            onClick={this.changeToState
                                .bind(this, this.props.states.LIST)}>
                            <div className="backArrow"></div>
                        </div>
                    </header>
                    <ul className="accounts-list">
                        {
                            this.state.selected.map((acc) => {
                                let cname = ''
                                if (selectedSet.indexOf(acc) != -1) {
                                    cname = 'toggled'
                                }
                                return (
                                    <li
                                        onClick=
                                            {this.handleClick.bind(this, acc)}
                                        className={cname}
                                        key={acc}>
                                        {acc}
                                    </li>
                                )
                            })
                        }
                        <li className="newAccount"
                            onClick={this.toggleNewAccount.bind(this)}>
                            <div className="oplus"></div>
                        </li>
                    </ul>
                    <button
                        type="submit"
                        onClick={this.handleNext.bind(this)}
                        disabled={this.state.nextdisabled}>
                        Next
                    </button>
                </div>
            )
        case this.props.states.PUBKEY:
            console.log('STATE: Pubkey')
            return (
                <div>
                    <header className="newaccount-header">
                        Send to Public Key
                        <div className="close-button"
                            onClick={this.toggleCloseModal.bind(this)}>X</div>
                    </header>
                    <div className='notice-info'>
                        <header>Account Pubkey Not Found</header>
                        <p>This account has not made a transaction, please submit
                        the public key to send a message.</p>
                    </div>
                    <ul className="new-account-form">
                        <li>
                            <div className="group">
                                <input
                                    type="text"
                                    value={this.state.sendPubKey}
                                    onChange=
                                        {
                                            this.handlePubKeyChange.bind(this)
                                        }
                                />
                                <span className="highlight"></span>
                                <span className="bar"></span>
                                <label>PublicKey</label>
                            </div>
                        </li>
                        <li>
                            <button onClick={this.handlePubkeySubmit}>
                                Ok
                            </button>
                        </li>
                    </ul>
                </div>
            )
        }
    }
}
