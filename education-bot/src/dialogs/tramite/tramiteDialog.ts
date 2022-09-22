// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TimexProperty } from '@microsoft/recognizers-text-data-types-timex-expression';
import { InputHints, MessageFactory } from 'botbuilder';
import {
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} from 'botbuilder-dialogs';
import { TramiteDetails } from './tramiteDetails';
import { CancelAndHelpDialog } from './cancelAndHelpDialog';


const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

export class TramiteDialog extends CancelAndHelpDialog {
    constructor(id: string) {
        super(id || 'tramiteDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    /**
     * Confirm the information the user has provided.
     */
    private async confirmStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const tramiteDetails = stepContext.options as TramiteDetails;

        const messageText = `Por favor, confirma el tramite que deseas realizar: ${ tramiteDetails.documento } . Es el tramite que pediste?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            const tramiteDetails = stepContext.options as TramiteDetails;

            return await stepContext.endDialog(tramiteDetails);
        }
        return await stepContext.endDialog();
    }
}
