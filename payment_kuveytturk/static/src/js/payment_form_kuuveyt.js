odoo.define("payment_kuveytturk.payment_form", function(require) {
    "use strict";

    const core = require("web.core");
    const ajax = require("web.ajax");

    const checkoutForm = require("payment.checkout_form");
    const manageForm = require("payment.manage_form");
    const Dialog = require("web.Dialog");

    const _t = core._t;

    if ($.blockUI) {
        $.blockUI.defaults.css.border = '0';
        $.blockUI.defaults.css["background-color"] = '';
        $.blockUI.defaults.overlayCSS["opacity"] = '0.9';
    }

    const kuveytturkMixin = {
        /**
         * Return all relevant inline form inputs based on the payment method type of the acquirer.
         *
         * @private
         * @param {number} acquirerId - The id of the selected acquirer
         * @return {Object} - An object mapping the name of inline form inputs to their DOM element
         */
        _getInlineFormInputskuveytturk: function(acquirerId) {

            console.log("kuveytturk ===>>:>_getInlineFormInputs");
            console.log("Hello psiGate ===>>:>_getInlineFormInputsPsi");
            let provider= this._get_selected_acquirer_information()
            if (provider=== 'kuveytturk') {
                return {
                    acquirer_id: document.getElementById(`acquirer_id`),
                    acquirer_state: document.getElementById(`acquirer_state`),
                    store_id: document.getElementById(`store_id`),
                    pass_phrase: document.getElementById(`pass_phrase`),
                    order_id: document.getElementById(`order_id`),
                    // reference: document.getElementById(`reference`),
                    window_href: document.getElementById(`window_href`),
                    // Card Informations
                    card: document.getElementById(`o_psigate_card_${acquirerId}`),
                    month: document.getElementById(`o_psigate_month_${acquirerId}`),
                    year: document.getElementById(`o_psigate_year_${acquirerId}`),
                    code: document.getElementById(`o_psigate_code_${acquirerId}`),
                };
            }


        },

        _get_selected_acquirer_information:function(){
            let a=document.querySelector('input[name="o_payment_radio"]:checked').dataset;
            return  a.provider;
        },

        /**
         * Return the credit card or bank data to pass to the Accept.dispatch request.
         *
         * @private
         * @param {number} acquirerId - The id of the selected acquirer
         * @return {Object} - Data to pass to the Accept.dispatch request
         */
        getPaymentDetailsPsi: function(acquirerId) {
            const inputs = this._getInlineFormInputsPsi(acquirerId);
            console.log("getPaymentDetailsPsiinputs ===>>>", inputs);
            console.log("cardNumber ===>>>", inputs.card.value.replace(/ /g, ''));
            console.log("month ===>>>", inputs.month.value);
            console.log("year ===>>>", inputs.year.value);
            console.log("cardCode ===>>>", inputs.code.value);
            let provider= this._get_selected_acquirer_information()
            if (provider=== 'psigate') {
                return {
                    cardData: {
                        cardNumber: inputs.card.value.replace(/ /g, ''), // Remove all spaces
                        month: inputs.month.value,
                        year: inputs.year.value,
                        cardCode: inputs.code.value,
                    },
                    opaqueData: {
                        acquirer_id: inputs.acquirer_id.value,
                        order_id: inputs.order_id.value,
                        store_id: inputs.store_id.value,
                        pass_phrase: inputs.pass_phrase.value,
                        // email_option: inputs.email_option.value,
                        // marchants_email: inputs.marchants_email.value,
                        // order_status: inputs.order_status.value,
                        // debug_logging: inputs.debug_logging.value,
                    }
                };
            }
        },

         _revokeBlockUI: function () {
            if ($.blockUI) {
                $.unblockUI();
            }
            // $("#o_payment_form_pay").removeAttr('disabled');
             this._disableButton(true);
        },
        getkuveytturkFormData: function ($form) {
            debugger
            var unindexed_array = $form.prevObject.prevObject.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function (n, i) {
                indexed_array[n.name] = n.value;
            });
            return indexed_array;
        },

        _getFormData: function () {
            var acquirerForm = this.$(".kuveytturk_form");
            var inputsForm = $("input", acquirerForm);
            var formData = this.getkuveytturkFormData(inputsForm);

            return formData;
        },



        _buildPopup: function () {
            debugger
            // var checked_radio = $('input[name="pm_id"]:checked');
            var checked_radio = this.$('input[type="radio"]:checked');
            if (checked_radio[0].dataset.provider == "kuveytturk") {
                this._revokeBlockUI();
                var data = this.formData;
                debugger
                var KuveytTurkModal = `
<div id="kuveytturk_payment_form_modal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-lg" style="margin-top:100px;">
        <form action="/shop/payment/pay" method="post" class="payment-form-box" >
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Pay with KuveytTürk</h4>
                    <button type="button" class="close fa fa-times" data-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="OkUrl" value="${data.OkUrl}" />
                    <input type="hidden" name="FailUrl" value="${data.FailUrl}" />
                    <input type="hidden" name="HashData" value="${data.HashData}" />
                    <input type="hidden" name="MerchantId" value="${data.MerchantId}" />
                    <input type="hidden" name="CustomerId" value="${data.CustomerId}" />
                    <input type="hidden" name="UserName" value="${data.UserName}" />
                    <input type="hidden" name="CardType" value="${data.CardType}" />
                    <input type="hidden" name="TransactionType" value="${data.TransactionType}" />
                    <input type="hidden" name="InstallmentCount" value="${data.InstallmentCount}" />
                    <input type="hidden" name="TransactionType" value="${data.TransactionType}" />
                    <input type="hidden" name="Amount" value="${data.Amount}" />
                    <input type="hidden" name="DisplayAmount" value="${data.DisplayAmount}" />
                    <input type="hidden" name="CurrencyCode" value="${data.CurrencyCode}" />
                    <input type="hidden" name="MerchantOrderId" value="${data.MerchantOrderId}" />
                    <input type="hidden" name="TransactionSecurity" value="${data.TransactionSecurity}" />
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Card Holder Name:</label>
                                <input type="text" name="CardHolderName" class="form-control" value="${data.state == 'test' ? data.CardHolderName : ''}" />
                            </div>
                            <div class="form-group">
                                <label>Card Number:</label>
                                <input type="text" name="CardNumber_display" class="form-control" value="${data.state == 'test' ? '4033602562020327' : ''}" />
                                <input type="hidden" name="CardNumber" class="form-control" value="${data.state == 'test' ? '4033602562020327' : ''}" />
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label>Month:</label>
                                    <input type="text" name="CardExpireDateMonth" class="form-control" value="${data.test_mode == '1' ? '01' : ''}"  />
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Year:</label>
                                    <input type="text" name="CardExpireDateYear" class="form-control" value="${data.test_mode == '1' ? '30' : ''}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Security Code:</label>
                                <input type="text" name="CardCVV2" class="form-control" value="${data.test_mode == '1' ? '861' : ''}" />
                            </div>
                        </div>
                        <div class="col-sm-6" style="margin-top:7%;">
                            <div class='card-wrapper'></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <!--<button type="button" class="btn btn-default" data-dismiss="modal"> Close </button>-->
                    <button type="submit" class="btn btn-primary btn-block submit"><i class="fa fa-credit-card"></i> Pay Now </button>
                </div>
            </div>
        </form>
    </div>
</div>`;
                $(document).ready(function () {
                    "use strict";
                    $('form.payment-form-box').card({
                        container: '.card-wrapper',

                        formSelectors: {
                            nameInput: 'input[name="CardHolderName"]',
                            numberInput: 'input[name="CardNumber_display"]',
                            expiryInput: 'input[name="CardExpireDateMonth"], input[name="CardExpireDateYear"]',
                            cvcInput: 'input[name="CardCVV2"]'
                        }
                    });
                    $('form.payment-form-box input[name="CardNumber_display"]').on('keyup paste', function () {
                        $('form.payment-form-box input[name="CardNumber"]').val($(this).val().replace(/\s/g, ''));
                    });
                });
                $(KuveytTurkModal).appendTo('#wrapwrap');
                $("#kuveytturk_payment_form_modal").modal('show');
                $("#kuveytturk_payment_form_modal").on("hidden.bs.modal", function () {
                    $(this).remove();
                    $("#o_payment_form_pay").removeAttr('disabled');
                    $("#o_payment_form_pay .o_loader").remove();
                    window.location.reload();
                });
            }
        },

        /**
         * Prepare the inline form of Authorize.Net for direct payment.
         *
         * @override method from payment.payment_form_mixin
         * @private
         * @param {string} provider - The provider of the selected payment option's acquirer
         * @param {number} paymentOptionId - The id of the selected payment option
         * @param {string} flow - The online payment flow of the selected payment option
         * @return {Promise}
         */
        _prepareInlineForm: function(provider, paymentOptionId, flow) {
            debugger;
            console.log("_prepareInlineForm");
            if (provider !== "kuveytturk") {
                return this._super(...arguments);
            }



            if (flow === "token") {
                return Promise.resolve(); // Don't show the form for tokens
            }

            this._setPaymentFlow("direct");

            let acceptJSUrl = "https://gateway.moneris.com/chkt/js/chkt_v1.00.js";
            this.formData = this._getFormData();
            return this._buildPopup()


        },

        /**
         * Dispatch the secure data to PSi Gate.
         *
         * @override method from payment.payment_form_mixin
         * @private
         * @param {string} provider - The provider of the payment option's acquirer
         * @param {number} paymentOptionId - The id of the payment option handling the transaction
         * @param {string} flow - The online payment flow of the transaction
         * @return {Promise}
         */
        _processPayment: function(provider, paymentOptionId, flow) {
            // console.log("--------------------------------------");
            // console.log("PSi Gate ==>>>_processPayment ===>>>>");
            // console.log("provider ===>>>>", provider);
            // console.log("paymentOptionId ===>>>>", paymentOptionId);
            // console.log("flow ===>>>>", flow);
            // console.log("psigateInfo ===>>>>", this.psigateInfo);
            // console.log("--------------------------------------");

            if (provider !== "psigate" || flow === "token") {
                return this._super(...arguments); // Tokens are handled by the generic flow
            }
            //debugger;

            if (!this._validateFormInputsPsi(paymentOptionId)) {
                this._enableButton(); // The submit button is disabled at this point, enable it
                return Promise.resolve();
            }


            // Build the authentication and card data objects to be dispatched to PSi Gate
            const secureData = {
                authData: {
                    StoreId: this.psigateInfo.store_id,
                    PassPhrase: this.psigateInfo.pass_phrase,
                    CheckoutId: this.psigateInfo.pass_phrase,
                },
                ...this.getPaymentDetailsPsi(paymentOptionId),
            };

            return this.responseHandlerPsi(paymentOptionId, secureData)
        },

        //--------------------------------------------------------------------------
        // Private
        //--------------------------------------------------------------------------

        /**
         * Payment Request for PSi Gate
         *
         * @override method from payment.payment_form_mixin
         * @private
         * @param {string} provider - The provider of the acquirer
         * @param {number} acquirerId - The id of the acquirer handling the transaction
         * @param {object} processingValues - The processing values of the transaction
         * @return {Promise}
         */
        _processDirectPayment: function(provider, acquirerId, processingValues) {
            console.log("provider ===>>>", provider);
            console.log("acquirerId ===>>>", acquirerId);
            console.log("processingValues ===>>>", processingValues);

            if (provider !== "psigate") {
                return this._super(...arguments);
            }

            // const acquirer_id = document.getElementById("psigate_acquirer_id").value;
            // const acquirer_state = document.getElementById("psigate_acquirer_state").value;
            // const store_id = document.getElementById("store_id").value;
            // const pass_phrase = document.getElementById("pass_phrase").value;
            // const order_id = document.getElementById("order_id").value;
            // const window_href = document.getElementById("window_href").value;


            return this._rpc({
                route: "/payment/psigate/payment",
                params: {
                    reference: processingValues.reference,
                    customer_input: customerInput,
                },
            }).then(() => {
                window.location = "/payment/status";
            });
        },

        /**
         * Handle the response from PSi Gate and initiate the payment.
         *
         * @private
         * @param {number} acquirerId - The id of the selected acquirer
         * @param {object} secureData - The secureData from PSi Gate Form
         * @return {Promise}
         */
        responseHandlerPsi: function(acquirerId, secureData) {
            // Create the transaction and retrieve the processing values
            console.log("_secureDataHandler");
            console.log("acquirerId ===>>>>", acquirerId);
            console.log("secureData ===>>>>", secureData)

            console.log("route ===>>>>", this.txContext.transactionRoute)
            console.log("_prepareTransactionRouteParams ===>>>>", this._prepareTransactionRouteParams('psigate', acquirerId, 'direct'))
            let provider = this._get_selected_acquirer_information()
            if (provider === 'psigate') {
                return this._rpc({
                    route: this.txContext.transactionRoute,
                    params: this._prepareTransactionRouteParams('psigate', acquirerId, 'direct'),
                })
                    .then((processingValues) => {
                        // Initiate the payment
                        console.log("processingValues ===>>>", processingValues)
                        return this._rpc({
                            route: "/payment/psigate/payment",
                            params: {
                                'reference': processingValues.reference,
                                'partner_id': processingValues.partner_id,
                                'opaque_data': secureData,
                                'access_token': processingValues.access_token,
                            },
                        }).then(() => (window.location = "/payment/status"));
                    })
                    .guardedCatch((error) => {
                        error.event.preventDefault();
                        this._displayError(
                            _t("Server Error"),
                            _t("We are not able to process your payment."),
                            error.message.data.message
                        );
                    });
            }
        },

        wait:function (ms)
        {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        },

        /**
         * Checks that all payment inputs adhere to the DOM validation constraints.
         *
         * @private
         * @param {number} acquirerId - The id of the selected acquirer
         * @return {boolean} - Whether all elements pass the validation constraints
         */
        _validateFormInputsPsi: function(acquirerId) {
            const inputs = Object.values(this._getInlineFormInputsPsi(acquirerId));
            //debugger;
            if (document.getElementById("psigate_3d_secure").value === 'True') {
                try {
                    let cardStatus = document.querySelector("#CardStatus").value
                    if (cardStatus === '') {
                        throw new Error(_t("Internal error, Please try again !!"))
                    }
                    if (cardStatus === 'N') {

                        throw new Error(document.querySelector("#transStatusReasonDetail").value)
                    }
                    // if (tds.pollingResponse !== null) {
                    //     if (tds.pollingResponse.status === 'N') {
                    //         // throw tds.pollingResponse.transactionStatusReasonDetail
                    //         throw new Error (tds.pollingResponse.transStatusReasonDetail)
                    //     }
                    // } else {
                    //
                    //     throw new Error (_t("Network Error!!"))
                    // }
                } catch (err) {
                    // err.event.preventDefault();
                    this._displayError(
                        _t("Server Error"),
                        _t("We are not able to process your payment."),
                        _t("3DS:" + err.message)
                    );
                    if (err.message === 'tds is not defined') {
                        location.reload()
                    }
                    // debugger;
                    // framework.blockUI();
                    //    this.wait(2000)
                    // framework.unblockUI();
                    return
                }
            }

            console.log("_validateFormInputsPsi ===>>>");
            console.log("inputs ===>>>", inputs);
            return inputs.every((element) => element.reportValidity());
        },


        // PSi Gate Functions

        /**
         * called when clicking on pay now or add payment event.
         *
         * @private
         * @param {Event} ev
         * @param {DOMElement} checkedRadio
         * @param {Boolean} addPmEvent
         */
        _createPsigateToken: function(ev, checked_radio, addPmEvent) {
            var acquirerID = this.getPsiGateAcquirerIdFromRadio(checked_radio);
            var acquirerForm = this.$(".psigate_form");
            var inputsForm = $("input", acquirerForm);
            var formData = this.getPsiGateFormData(inputsForm);

            if (this.options.partnerId === undefined) {
                console.warn(
                    "payment_form: unset partner_id when adding new token; things could go wrong"
                );
            }
            var checked_radio = this.$('input[type="radio"]:checked');
            var acquirer_id = this.getPsiGateAcquirerIdFromRadio(checked_radio);

            if (checked_radio) {
                if (checked_radio[0].dataset.provider == "psigate") {
                    if (
                        window.location.href.includes("/shop/payment") ||
                        window.location.href.includes("my/orders") ||
                        window.location.href.includes("/my/invoices/") ||
                        window.location.href.includes("/my/payment_method") ||
                        window.location.href.includes("/website_payment")
                    ) {
                        var myCheckout = new psigate();
                        var self = this;

                        console.log("Create  myCheckout==>>>");
                        console.log(
                            "  formData.acquirer_state==>>>",
                            formData.acquirer_state
                        );

                        if (formData.acquirer_state === "test") {
                            myCheckout.setMode("qa");
                        } else {
                            myCheckout.setMode("prod");
                        }
                        myCheckout.setCheckoutDiv("psigate");
                        myCheckout.setCallback("page_loaded", myPageLoad);
                        myCheckout.setCallback("cancel_transaction", myCancelTransaction);
                        myCheckout.setCallback("error_event", myErrorEvent);
                        myCheckout.setCallback("payment_receipt", myPaymentReceipt);
                        myCheckout.setCallback("payment_complete", myPaymentComplete);
                        myCheckout.setCallback("page_closed", myPageClosed);
                        myCheckout.setCallback("payment_submitted", myPaymentSubmitted);

                        var session = session;
                        var data = formData;
                        data.acquirer_id = acquirer_id;
                        data.href = window.location.href;

                        if (window.location.href.includes("my/orders")) {
                            data.sale_order_id = window.location.href
                                .split("my/orders")[1]
                                .split("/")[1]
                                .split("?")[0];
                        }

                        if (window.location.href.includes("/my/invoices/")) {
                            var invoice_id = window.location.href
                                .split("/my/invoices/")[1]
                                .split("?")[0];
                            data.invoice_id = invoice_id;
                        }

                        var self = this;
                        ajax
                            .jsonRpc("/payment/psigate/preload", "call", data)
                            .then(function(result) {
                                var result = JSON.parse(result);
                                console.log("result", result);

                                if (result.response.ticket) {
                                    var ticket = result.response.ticket;
                                    self._enableButton();

                                    console.log("remove class[d-none]");

                                    const $submitButton = $(
                                        'button[name="o_payment_submit_button"]'
                                    );
                                    $submitButton.removeClass("d-none");
                                    var chktLoading =
                                        document.getElementsByClassName("monerisBody");
                                    if (chktLoading.length > 0) {
                                        chktLoading[0].style.display = "none";
                                    }
                                    myCheckout.startCheckout([ticket]);
                                }

                                if (result.response.ticket) {
                                    if (
                                        window.location.href.includes("/shop/payment") ||
                                        window.location.href.includes("/my/payment_method") ||
                                        window.location.href.includes("/my/orders") ||
                                        window.location.href.includes("my/invoices") ||
                                        window.location.href.includes("pay/invoices")
                                    ) {
                                        $("#monerisModal").modal();
                                    }
                                }

                                if (result.response.success == "false") {
                                    try {
                                        console.log(
                                            "payment_method",
                                            window.location.href.includes("/my/payment_method")
                                        );
                                        if (window.location.href.includes("/my/payment_method")) {} else {
                                            var monerisBtnCncl =
                                                document.getElementById("monerisBtnCncl");
                                            if (monerisBtnCncl) {
                                                monerisBtnCncl.click();
                                            }
                                        }

                                        console.log("**********ENDS**************");
                                    } catch (error) {}

                                    if (result.response.error) {
                                        alert(_t(JSON.stringify(result.response.error)));
                                        if (document.getElementsByName("o_payment_submit_button")) {
                                            // document.getElementsByName("o_payment_submit_button")[0].removeClass("o_loader");
                                            // document.getElementsByName("o_payment_submit_button")[0].disabled = "false";
                                            self._enableButton();
                                        }
                                    }
                                }
                            });
                    }
                }
            }
        },

        /**
         * @private
         * @param {DOMElement} element
         */
        getPsiGateAcquirerIdFromRadio: function(element) {
            return $(element).data("paymentOptionId");
        },

        // payMonerisEvent: function(ev) {
        //     console.log("payMonerisEvent");
        //     ev.preventDefault();
        //     var checked_radio = this.$('input[type="radio"]:checked');

        //     if (
        //         checked_radio.length === 1 &&
        //         this.isNewPaymentRadio(checked_radio) &&
        //         checked_radio.data("provider") === "psigate"
        //     ) {
        //         if (window.location.href.includes("/my/invoices/")) {
        //             var pay_with = document.getElementById("pay_with");
        //             if (pay_with != undefined) {
        //                 pay_with.style.display = "none";
        //             }
        //         }

        //         if (window.location.href.includes("/website_payment")) {
        //             var modalaccept = document.getElementById("modalaccept");
        //             if (modalaccept != undefined) {
        //                 modalaccept.style.display = "none";
        //             }
        //             var modalaccept = document.getElementById("modalaccept");
        //         }

        //         var btnPay = document.getElementById("o_payment_form_pay");
        //         btnPay.dataset.toggle = "modal";
        //         btnPay.dataset.target = "#monerisModal";
        //         $("#monerisModal").modal({ backdrop: "static", keyboard: false });

        //         this._createPsigateToken(ev, checked_radio);
        //     } else {
        //         this._super.apply(this, arguments);
        //     }
        // },

        /**
         * @private
         * @param {jQuery} $form
         */
        getPsiGateFormData: function($form) {
            var unindexed_array = $form.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function(n, i) {
                indexed_array[n.name] = n.value;
            });
            return indexed_array;
        },
    };

    checkoutForm.include(kuveytturkMixin);
    manageForm.include(kuveytturkMixin);
});