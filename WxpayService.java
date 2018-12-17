package cc.coincard.payment.wxpay.service;

import cc.coincard.backend.common.constants.BaseConstants;
import cc.coincard.backend.common.exception.CCException;
import cc.coincard.backend.common.exception.ErrorCode;
import cc.coincard.backend.common.model.RSAEncrypt;
import cc.coincard.backend.common.service.ApiService;
import cc.coincard.backend.common.utils.WxUtils;
import cc.coincard.backend.interfaces.config.IConfigService;
import cc.coincard.payment.base.constants.Constants;
import cc.coincard.payment.base.properties.ConfigProperties;
import cc.coincard.payment.wxpay.request.*;
import cc.coincard.payment.wxpay.response.*;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * Created payment on 2017/9/19.
 */
@Service
public class WxpayService {

    private static Logger logger = LoggerFactory.getLogger(WxpayService.class);

    @Autowired
    private IConfigService configService;

    @Autowired
    private ConfigProperties configProperties;
    @Autowired
    private ApiService apiService;

    private ThreadLocal<RSAEncrypt> rsaEncrypts;

    @PostConstruct
    private void init() {

        rsaEncrypts = ThreadLocal.withInitial(() -> RSAEncrypt.fromPath(
                configProperties.getWxpayUnionPayPubKeyPath(),
                configProperties.getWxpayPriKeyPath(),
                configProperties.getWxpayPriKeyPasswd()
        ));
    }

    private static String getTempStr(Object value) {

        if (null == value) {
            return "";
        }
        TreeMap<String, Object> attrMap = new TreeMap<>();
        for (Field f : value.getClass().getFields()) {
            JacksonXmlProperty xmlField = f.getAnnotation(JacksonXmlProperty.class);
            if (null == xmlField) {
                continue;
            }
            try {
                attrMap.put(xmlField.localName(), f.get(value));
            } catch (Exception e) {
                logger.error("Get Xml Field Error:" + e.getLocalizedMessage(), e);
            }
        }

        StringBuilder sb = new StringBuilder();
        Set es = attrMap.entrySet();
        Iterator<Map.Entry<String, Object>> it = es.iterator();
        while (it.hasNext()) {
            Map.Entry<String, Object> entry = it.next();
            String k = entry.getKey();
            Object v = entry.getValue();
            if (null != v
                    && !"".equals(v)
                    && !"sign".equals(k)
                    && !"key".equals(k)) {
                if (sb.length() > 0) {
                    sb.append("&");
                }
                sb.append(k).append("=").append(v);
            }
        }
        final String tempStr = sb.toString();
        logger.debug("sign key=" + tempStr);
        return tempStr;
    }

    public String getSignStr(Object value) {

        String sign = null;
        try {
            sign = rsaEncrypts.get().signBase64(getTempStr(value));
        } catch (Exception e) {
            logger.error("Sign Error:" + e.getLocalizedMessage(), e);
        }
        return sign;
    }

    public static String errMsg(BaseResponse resp) {

        if (null == resp) {
            return "null";
        }
        String result = "";
        if (StringUtils.hasLength(resp.returnMsg)) {
            result = resp.returnMsg + ",";
        }
        if (StringUtils.hasLength(resp.errCodeDes)) {
            result += resp.errCodeDes;
        }
        return result;
    }

    private void fillWxParams(WxBaseRequest baseReq) {

        baseReq.appId = configProperties.getWxpayAppId();
        switch (baseReq.channel) {
            case Constants.WX_CHANNEL_0:
                baseReq.mchId = configProperties.getWxpayMchId0();
                break;
            case Constants.WX_CHANNEL_2:
                baseReq.mchId = configProperties.getWxpayMchId2();
                break;
            case Constants.WX_CHANNEL_6:
                baseReq.mchId = configProperties.getWxpayMchId6();
                break;
            default:
                logger.error("Fill Wx Params, But Unknown channel:" + baseReq.channel);
                throw new CCException(ErrorCode.PARAM_ERROR);
        }
        baseReq.nonceStr = WxUtils.noiceStr();
        baseReq.signType = "RSA";
        baseReq.sign = getSignStr(baseReq);
    }

    public void fillSubMchId(WxBaseRequest baseReq, int payType,
                             String subMchId0, String subMchId2, String subMchId6,
                             String wxChannelId, String wxOnlineChannelId) {

        if (BaseConstants.TYPE_OFFLINE == payType
                || BaseConstants.TYPE_ALI_OFFLINE == payType
                || BaseConstants.TYPE_WEB == payType
                || BaseConstants.TYPE_ALI_WEB == payType) {
            baseReq.channel = Constants.WX_CHANNEL_2;
            baseReq.subMchId = subMchId2;
            baseReq.channelId = wxChannelId;
        } else if (BaseConstants.TYPE_APP == payType
                || BaseConstants.TYPE_H5 == payType) {
            baseReq.channel = Constants.WX_CHANNEL_6;
            baseReq.subMchId = subMchId6;
            baseReq.channelId = wxOnlineChannelId;
        }
    }

    /**
     * 微信统一下单接口
     */
    public WxUnifiedOrderResponse unifiedOrder(WxUnifiedOrderRequest request) {

//        if (configProperties.getSandBox()) {
//            request.openid = ValueUtils.nullAs(configService.get("unionpay_test_openid"), "");
//        }

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxUnifiedOrderResponse.class, Constants.WXPAY_SANDBOX_UNIFIEDORDER_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxUnifiedOrderResponse.class, Constants.WXPAY_UNIFIEDORDER_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    public boolean downloadBills(WxDownloadOrdersRequest request, String savePath) {

//        fillWxParams(request);
//
//        if (configProperties.getSandBox()) {
//            return apiService.doPost(Constants.WXPAY_SANDBOX_DOWNLOADBILL_URL, request, savePath,
//                    "application/xml", "utf-8", true);
//        } else {
//            return apiService.doPost(Constants.WXPAY_DOWNLOADBILL_URL, request, savePath,
//                    "application/xml", "utf-8", true);
//        }
        return false;
    }

    /**
     * 微信订单查询接口
     */
    public WxGetOpenIdResponse getOpenId(WxGetOpenIdRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxGetOpenIdResponse.class, Constants.WXPAY_SANDBOX_GET_OPEN_ID_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxGetOpenIdResponse.class, Constants.WXPAY_SANDBOX_GET_OPEN_ID_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 微信订单查询接口
     */
    public WxOrderQueryResponse orderQuery(WxOrderQueryRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxOrderQueryResponse.class, Constants.WXPAY_SANDBOX_ORDERQUERY_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxOrderQueryResponse.class, Constants.WXPAY_ORDERQUERY_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 微信关单接口
     */
    public WxCloseOrderResponse closeOrder(WxCloseOrderRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxCloseOrderResponse.class, Constants.WXPAY_SANDBOX_CLOSEORDER_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxCloseOrderResponse.class, Constants.WXPAY_CLOSEORDER_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 微信申请退款接口
     */
    public WxRefundResponse refund(WxRefundRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxRefundResponse.class, Constants.WXPAY_SANDBOX_REFUND_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxRefundResponse.class, Constants.WXPAY_REFUND_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 微信查询退款
     */
    public WxRefundQueryResponse refundQuery(WxRefundQueryRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxRefundQueryResponse.class, Constants.WXPAY_SANDBOX_REFUNDQUERY_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxRefundQueryResponse.class, Constants.WXPAY_REFUNDQUERY_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    public WxRefundQueryResponse refundQueryAll(WxRefundQueryRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxRefundQueryResponse.class, Constants.WXPAY_SANDBOX_REFUNDQUERY_BATCH_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxRefundQueryResponse.class, Constants.WXPAY_REFUNDQUERY_BATCH_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 提交刷卡支付
     */
    public WxMicroPayResponse microPay(WxMicroPayRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxMicroPayResponse.class, Constants.WXPAY_SANDBOX_MICROPAY_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxMicroPayResponse.class, Constants.WXPAY_MICROPAY_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 撤销订单
     */
    public WxReverseResponse reverse(WxReverseRequest request) {

        fillWxParams(request);

        if (configProperties.getSandBox()) {
            return apiService.doPost(WxReverseResponse.class, Constants.WXPAY_SANDBOX_REVERSE_URL, request,
                    "application/xml", "utf-8", true);
        } else {
            return apiService.doPost(WxReverseResponse.class, Constants.WXPAY_REVERSE_URL, request,
                    "application/xml", "utf-8", true);
        }
    }

    /**
     * 微信支付结果通知
     */
    public boolean validPayResult(WxNotifyRequest request) {

        if (null == request) {
            return false;
        }

        String tempStr = getTempStr(request);
        return rsaEncrypts.get().verifyBase64(tempStr, request.sign);
    }

}
