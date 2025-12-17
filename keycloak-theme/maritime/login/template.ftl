<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html>
<html<#if realm.internationalizationEnabled> lang="${locale.currentLanguageTag}"</#if>>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body>
    <div id="kc-container">
        <div id="kc-container-wrapper">
            
            <#if realm.internationalizationEnabled && locale.supported?size gt 1>
                <div id="kc-locale">
                    <div id="kc-locale-wrapper">
                        <div id="kc-locale-dropdown">
                            <select onchange="window.location.href=this.value">
                                <#list locale.supported as l>
                                    <option value="${l.url}" <#if l.languageTag == locale.currentLanguageTag>selected</#if>>${l.label}</option>
                                </#list>
                            </select>
                        </div>
                    </div>
                </div>
            </#if>
            
            <div class="login-pf-page">
                <div class="card-pf">
                    <!-- Header with logo -->
                    <header class="card-header">
                        <div class="logo-wrapper">
                            <div class="logo">
                                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#E53935" stroke-width="2"/>
                                    <circle cx="12" cy="12" r="4" fill="#E53935"/>
                                </svg>
                                <span class="logo-text">Trans<span class="logo-highlight">TRACK</span></span>
                            </div>
                            <span class="copyright">&copy; 2016 - 2025 PT. Indo Trans Teknologi. All Rights Reserved.</span>
                        </div>
                    </header>
                    
                    <div class="card-body">
                        <!-- Form Section -->
                        <div class="form-section">
                            <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                                <div class="alert alert-${message.type}">
                                    <span class="message-text">${kcSanitize(message.summary)?no_esc}</span>
                                </div>
                            </#if>

                            <div id="kc-form-header">
                                <h1 id="kc-page-title"><#nested "header"></h1>
                            </div>

                            <#nested "form">

                            <#if auth?has_content && auth.showTryAnotherWayLink() && showAnotherWayIfPresent>
                                <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post">
                                    <div>
                                        <input type="hidden" name="tryAnotherWay" value="on"/>
                                        <a href="#" id="try-another-way" onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                                    </div>
                                </form>
                            </#if>

                            <#nested "socialProviders">

                            <#if displayInfo>
                                <div id="kc-info">
                                    <div id="kc-info-wrapper">
                                        <#nested "info">
                                    </div>
                                </div>
                            </#if>
                            
                            <div class="version-text">v0.0.88</div>
                        </div>
                        
                        <!-- Illustration Section -->
                        <div class="illustration-section">
                            <img src="${url.resourcesPath}/img/ship-illustration.svg" alt="Maritime illustration" class="ship-illustration" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
</#macro>
