<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

//招商管理系统
$route['amMerchant']['post'] = 'Agent/work/create';
$route['amMerchant/(:num)']['get'] = 'Agent/work/get/$1';
$route['amMerchant/(:num)']['put'] = 'Agent/work/update/$1';
$route['amMerchant']['get'] = 'Agent/work/getMerchants';
$route['amMerchant/img']['post'] = 'Agent/work/upload';
//获取审核列表
$route['amMerchantList']['get'] = 'Agent/work/getMerchantList';
//审核状态-获取商户详情
$route['amMerchantInfo']['get'] = 'Agent/work/getMerchantInfo';
//审核状态-搜索商户
$route['amMerchantSearch']['get'] = 'Agent/work/searchMerchantName';

// 删除普通商户
$route['am_merchant/(:num)']['delete'] = 'Agent/work/delete/$1';

// 获取快速审核商户信息列表
$route['ammerchantv2']['get'] = 'Merchant/get_merchants';

// 删除快速审核商户
$route['am_merchant_v2/(:num)']['delete'] = 'Merchant/delete_merchant/$1';

// 创建新的商户审核单(绑卡专用)
$route['amMerchantv2']['post'] = 'Agent/work/create';

// 生成未绑定的二维码
$route['newMerchant/gen']['get'] = 'Branch/gen_branch_index';
// 生成未绑定的二维码
$route['newmerchant/gen/seq']['get'] = 'Branch/gen_branch_index_seq';
// 绑定二维码和指定门店
$route['newMerchant/bind/(:any)/(:num)']['put'] = 'Branch/bind_branch/$1/$2';
// 绑定二维码和指定门店(绑卡专用)
$route['newMerchantv2/bind']['put'] = 'Branch/bind_branchv2';

// 获取二清商户号
$route['newMerchant/apply']['post'] = 'Merchant/submitWftMerchant';
// 获取二清商户号(绑卡专用)
$route['newMerchantv2/apply']['post'] = 'Merchant/submitWftMerchantv2';

// 提交银行校验款
$route['amMerchant/(:num)/bankCode']['put'] = 'Agent/updateBankCode/$1';
// 通知钱侠合伙人指定审核流转信息
/*
 * 入参结构:
 * {
 *      openid: xxx,
 *      first: xxx,
 *      keyword1: xxx,
 *      keyword2: xxx,
 *      keyword3: xxx,
 *      remark: xxx
 * }
 */
$route['message']['post'] = 'Agent/pushMessage';

// 生成带渠道信息注册号，注册移动端用户
$route['agent/user/reg']['post'] = 'Agent/genRegidForUser';

// 钱侠合伙人
// 钱侠合伙人注册
$route['agent/reg']['get'] = 'Agent/genRegId';
$route['agent/reg']['post'] = 'Agent/regAgent';
// 获取钱侠合伙人信息
$route['agent/my']['get'] = 'Agent/getAgentInfo';
$route['agent/data']['get'] = 'Agent/getAgentData';

//普通代理商查看下线
$route['agent/employee']['get'] = 'Agent/getEmployee';
//普通代理商删除下线
$route['agent/employee/(:any)']['delete'] = 'Agent/deleteEmployee/$1';
//普通代理商修改下线
$route['agent/employee/(:any)']['put'] = 'Agent/updateEmployee/$1';
//普通代理商购买费率
$route['agent/ratio']['get'] = 'Agent/getRatio';
//普通代理商购买费率
$route['agent/ratio/(:num)/buy']['post'] = 'Agent/buyRatio/$1';
//购买费率后通知服务器端
$route['agent/ratio/(:num)/sign/(:num)']['post'] = 'Agent/saveRatioSign/$1/$2';
$route['agent/ratio/(:num)/check/(:num)']['post'] = 'Agent/checkRatioSign/$1/$2';

// 验证码服务
// 获取 更新验证码
$route['captcha']['post'] = 'Captcha/getCaptcha';
// 获取 更新语音验证码
$route['captcha/voice']['post'] = 'Captcha/getVoiceCaptcha';

// 钱侠合伙人返佣
// 获取钱侠合伙人返佣总额
$route['refund/sum']['get'] = 'Refund/getSumByOpenid';
// 获取钱侠合伙人历月返佣
$route['refund/detail']['get'] = 'Refund/getDetailByOpenid';
// 获取钱侠合伙人下个月可能产生的返佣
$route['refund/next']['get'] = 'Refund/getNextMonthRefund';
// 获取钱侠合伙人指定月日返佣明细
$route['refund/month/(:num)/detail']['get'] = 'Refund/getMonthDetailByOpenid/$1';
// 获取钱侠合伙人指定日各商户返佣明细
$route['refund/day/(:num)/merchant/detail']['get'] = 'Refund/getDayDetailByOpenid/$1';
// 获取钱侠合伙人指定日指定商户侠各门店返佣明细
$route['refund/day/(:num)/merchant/(:num)/branch/detail']['get'] = 'Refund/getDayBranchDetailByOpenid/$1/$2';

// 钱侠合伙人总订单数
// 获取钱侠合伙人总订单数
$route['transaction/count']['get'] = 'Transaction/getAgentTransCount';

// 钱侠合伙人提现相关信息
// 获取信息
$route['agent/deposit/info']['get'] = 'Agent/getDepositInfo';
// 更新信息
$route['agent/deposit/info']['put'] = 'Agent/updateDepositInfo';

// 获取开户银行列表
$route['bank/list']['get'] = 'Bank/getBankList';
// 查询银行编号
$route['bank/code']['get'] = 'Bank/getBankCodeList';
// 获取商户类目列表
$route['category/list']['get'] = 'Category/getCateList';
// 获取城市列表
$route['city/list']['get'] = 'City/getCityList';
// 获取城市列表(数组)
$route['city/array']['get'] = 'City/getCityArray';

// 获取门店信息(支持批量), 以id|id的形式批量查询
$route['merchant/(:num)/branch/(:any)']['get'] = 'Branch/getBranchInfo/$1/$2';
// 获取商户的门店列表
$route['merchant/(:num)/branch']['get'] = 'Branch/getBranchList/$1';
// 获取商户的所有门店销售信息
$route['merchant/(:num)/trans']['get'] = 'Branch/getTrans/$1';
// 获取商户的指定门店销售信息, (支持批量), 以id|id的形式批量查询
$route['merchant/(:num)/trans/(:any)']['get'] = 'Branch/getTrans/$1/$2';
// 新增门店
$route['merchant/(:num)/branch']['post'] = 'Branch/create/$1';
// 更新门店信息
$route['merchant/(:num)/branch/(:num)']['put'] = 'Branch/update/$1/$2';
// 获取商户信息
$route['merchant/(:any)']['get']= 'Merchant/getMerchantInfo/$1';
// 获取门店店员
$route['merchant/(:num)/branch/(:num)/clerk']['get'] = 'Branch/getClerk/$1/$2';

// 更新店员信息
$route['merchant/(:num)/branch/(:num)/clerk/(:num)']['put'] = 'Clerk/update/$1/$2/$3';
// 删除店员信息
$route['merchant/(:num)/branch/(:num)/clerk/(:num)']['delete'] = 'Clerk/delete/$1/$2/$3';
// 获取店员信息(支持批量), 以id|id的形式批量查询
$route['merchant/(:num)/branch/(:num)/clerk/(:any)']['get'] = 'Clerk/getClerkInfo/$1/$2/$3';

// 获取商户名下收款二维码
$route['qrcodePuzzle']['get'] = 'Merchant/mailWithQRCode';
$route['qrcodeUnbindPuzzle']['get'] = 'Merchant/mailWithUnbindQRCode';

//每天十点给代理商推送昨日营收情况
//$route['agent/yesterdayrefund']['get'] = 'Agent/getYesterdayRefund';

//48h商户未产生流水的告警通知
$route['agent/warning']['get'] = 'Agent/warning';

//发送模板消息给内部人员
$route['agent/message']['get'] = 'Agent/bankcodeMessage';

//代理商授权和商户解约接口
$route['agentMerchat/auth']['get']='Agent/auth';

$route['amMerchant']['post'] = 'Agent/work/create';

//业务员
$route['mobile_user/add']['post'] = 'Mobile_user/add';
$route['mobile_user/all']['post'] = 'Mobile_user/all';
$route['mobile_user/modify']['post'] = 'Mobile_user/modify';

$route['qrcode/qr']['get']='Qrcode/qr';
$route['qrcode/qr_hf']['get']='Qrcode/qr_hf';
$route['qrcode/tool']['post']='Qrcode/qr_tools';
$route['qrcode/qr_hf_single']['get']='Qrcode/qr_hf_single';
$route['qrcode/get_qrcode_list']['get']='Qrcode/get_qrcode_list';
$route['qrcode/down']['post']='Qrcode/qr_down';//下载已生产二维码
$route['qrcode/send_email']['post']='Qrcode/qr_send_email';//发送邮件
$route['qrcode/qr_code']['post']='Qrcode/qr_code';//执行自动生产二维码
$route['qrcode/delete']['post']='Qrcode/deleteQrLog';//执行删除

//移动端员工绑定
$route['mobile/agent/bind']['post']='Mobile_user/bind_agent';
//移动端绑定渠道

//移动端我的收益
$route['profit']['get'] = 'Profit/getProfit';
//保存草稿
$route['submitDraft']['post'] = 'Merchant/submitDraft';
//移动端添加商户
$route['submitWxMerchant']['post'] = 'Merchant/submitWxMerchant';
//移动端获取当前渠道费率
$route['getMerchantRate']['get'] = 'Merchant/getMerchantRate';
//获取草稿详情
$route['getDraftInfo']['get'] = 'Merchant/getDraftInfo';
//删除草稿
$route['deleteDraft']['get'] = 'Merchant/deleteDraft';
//获取草稿列表
$route['getDraftList']['post'] = 'Merchant/getDraftList';
//多级审核流
$route['merchantAudit']['post'] = 'Merchant/merchantAudit';
//获取渠道id/名称
$route['getMerchantAgent']['post'] = 'Merchant/getMerchantAgent';
//获取微信类目表
$route['wxcategorylist']['get'] = 'Wx_Category/getWxCategoryList';
$route['wxcatecodeupdate']['get']       = 'Wx_Category/updateDbOriginCateCode';
//获取支付宝类目表
$route['alicategorylist']['get'] = 'Ali_Category/getAliCategoryList';
$route['alicatecode']['get'] = 'Wx_Category/getAliCateCodeByWxCateCode';
//获取银行公众号openid
$route['redirect']['get'] = 'Merchant/redirect';

//open
$route['phoneAddMch']['post'] = 'Merchant/phoneAddMch';
$route['pcAddMch']['post'] = 'Merchant/pcAddMch';
$route['openAddMch']['post'] = 'Merchant/openAddMch';
$route['updateMchQQ']['post'] = 'Merchant/updateMchQQ';
//银联下属商户查询
$route['getMchInfo']['post'] = 'Merchant/getMchInfo';

//蓝海行动报名
$route['merchant/blue/join']['post'] = 'Merchant/bluejoin';
//蓝海行动确认接口
$route['merchant/blue/confirm']['post'] = 'Merchant/blueconfirm';
//蓝海行动解除接口
$route['merchant/blue/delete']['post'] = 'Merchant/bluedelete';
//蓝海通过审核通知接收地址
$route['merchant/blue/pass/notify']['post'] = 'Merchant/blue_notify_pass';
//蓝海活动拒绝通知接受
$route['merchant/blue/reject/notify']['post'] = 'Merchant/blue_notify_reject';


