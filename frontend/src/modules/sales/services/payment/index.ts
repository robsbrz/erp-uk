// src/modules/sales/services/payment/index.ts
import { UKPaymentService } from "./UKPaymentService";
import { SplitPaymentService, splitPaymentService } from "./SplitPaymentService";

const ukPaymentService = new UKPaymentService();

export { 
    UKPaymentService, 
    ukPaymentService,
    SplitPaymentService,
    splitPaymentService 
};
