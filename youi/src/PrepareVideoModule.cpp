#include "PrepareVideoModule.h"

#include <player/YiAbstractVideoPlayer.h>
#include <player/YiPlayReadyDRMConfiguration.h>
#include <player/YiWidevineModularDRMConfiguration.h>
#include <player/YiWidevineModularCustomRequestDRMConfiguration.h>

#include <youireact/ShadowTree.h>
#include <youireact/nodes/ShadowVideo.h>
#include <youireact/nodes/ShadowVideoRef.h>

#define LOG_TAG "PrepareVideoModule"

namespace
{
CYIAbstractVideoPlayer::StreamingFormat GetStreamingFormat(folly::dynamic source)
{
    CYIString type;

    if (source.isObject() && source["type"].isString())
    {
        type = source["type"].asString();
    }

    if (type.IsEmpty())
    {
        YI_LOGE(LOG_TAG, "Missing source type!\n\n{\n\turi: string,\n\ttype: string,\n\tdrmScheme: string,\n\tstartTimeMs: number\n\theaders: object,\n\tdrmInfo: object,\n}\n");
    }

    if (type == "MP4") return CYIAbstractVideoPlayer::StreamingFormat::MP4;
    else if (type == "Smooth") return CYIAbstractVideoPlayer::StreamingFormat::Smooth;
    else if (type == "DASH") return CYIAbstractVideoPlayer::StreamingFormat::DASH;
    else if (type == "HLS") return CYIAbstractVideoPlayer::StreamingFormat::HLS;
    else
    {
        YI_LOGE(LOG_TAG, "Invalid source type!\n\nValid types are:\n\tHLS\n\tMP4\n\tDASH\n\tSmooth\n\nDefaulting to HLS.");
    }

    return CYIAbstractVideoPlayer::StreamingFormat::HLS;
}

CYIAbstractVideoPlayer::PlaybackState GetPlaybackState(folly::dynamic source)
{
    bool autoPlay = false;

    if (source.isObject() && source["autoPlay"].isBool())
    {
        autoPlay = source["autoPlay"].asBool();
    }

    if (autoPlay) return CYIAbstractVideoPlayer::PlaybackState::Playing;
    
    return CYIAbstractVideoPlayer::PlaybackState::Paused;
}

std::unique_ptr<CYIAbstractVideoPlayer::DRMConfiguration> GetDRMConfiguration(folly::dynamic drmConfiguration)
{
    std::unique_ptr<CYIAbstractVideoPlayer::DRMConfiguration> drmConfig;

    if (!drmConfiguration.isObject() || !drmConfiguration["drmScheme"].isString())
    {
        return drmConfig;
    }

    auto drmScheme = drmConfiguration["drmScheme"].asString();

    if (drmScheme == "playready")
    {
        auto playReadyConfig = drmConfiguration["drmInfo"];
        if (!playReadyConfig.isObject())
        {
            return drmConfig;
        }

        auto licenseAcquisitionUrl = playReadyConfig["licenseAcquisitionUrl"].asString();
        auto licenseAcquisitionCustomData = playReadyConfig["licenseAcquisitionCustomData"].asString();
        
        if (licenseAcquisitionUrl.empty() || licenseAcquisitionCustomData.empty())
        {
            return drmConfig;
        }

        auto p_playReadyDrmConfig = std::make_unique<CYIPlayReadyDRMConfiguration>();

        p_playReadyDrmConfig->SetLicenseAcquisitionUrl(CYIUrl(licenseAcquisitionUrl));
        p_playReadyDrmConfig->SetLicenseAcquisitionCustomData(licenseAcquisitionCustomData);

        drmConfig = std::move(p_playReadyDrmConfig);

        return drmConfig;
    }
    else if (drmScheme == "widevine_modular")
    {
        auto widevineConfig = drmConfiguration["drmInfo"];
        if (!widevineConfig.isObject())
        {
            return drmConfig;
        }
        
        auto licenseAcquisitionUrl = widevineConfig["licenseAcquisitionUrl"].asString();
        if (licenseAcquisitionUrl.empty())
        {
            return drmConfig;
        }

        auto p_widevineDrmConfig = std::make_unique<CYIWidevineModularDRMConfiguration>();

        p_widevineDrmConfig->SetLicenseAcquisitionUrl(CYIUrl(licenseAcquisitionUrl));

        drmConfig = std::move(p_widevineDrmConfig);

        return drmConfig;
    }
    else if (drmScheme == "widevine_modular_custom_request")
    {
        auto widevineConfig = drmConfiguration["drmInfo"];
        if (!widevineConfig.isObject())
        {
            return drmConfig;
        }
        
        auto licenseAcquisitionUrl = widevineConfig["licenseAcquisitionUrl"].asString();
        if (licenseAcquisitionUrl.empty())
        {
            return drmConfig;
        }

        auto p_widevineDrmConfig = std::make_unique<CYIWidevineModularCustomRequestDRMConfiguration>();

        p_widevineDrmConfig->SetLicenseAcquisitionUrl(CYIUrl(licenseAcquisitionUrl));

        drmConfig = std::move(p_widevineDrmConfig);

        return drmConfig;
    }
    
    return drmConfig;
}
} // namespace

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(PrepareVideoModule);

PrepareVideoModule::PrepareVideoModule()
{}

PrepareVideoModule::~PrepareVideoModule()
{}

YI_RN_DEFINE_EXPORT_METHOD(PrepareVideoModule, prepare)
(Callback successCallback, Callback failedCallback, uint64_t tag, folly::dynamic source)
{
    CYIAbstractVideoPlayer *pPlayer = nullptr;

    auto &shadowRegistry = GetBridge().GetShadowTree().GetShadowRegistry();

    auto pComponent = shadowRegistry.Get(tag);
    if (!pComponent || !source.isObject() || !source["uri"].isString())
    {
        failedCallback({});
        return;
    }

    ShadowVideo *pShadowVideo = dynamic_cast<ShadowVideo *>(pComponent);
    if (pShadowVideo)
    {
        pPlayer = dynamic_cast<CYIAbstractVideoPlayer *>(&pShadowVideo->GetPlayer());
    }
    else
    {
        ShadowVideoRef *pShadowVideoRef = dynamic_cast<ShadowVideoRef *>(pComponent);
        if (pShadowVideoRef)
        {
            pPlayer = dynamic_cast<CYIAbstractVideoPlayer *>(&pShadowVideoRef->GetPlayer());
        }
    }

    if (pPlayer)
    {
        CYIString uri = source["uri"].asString();

        pPlayer->Prepare(CYIUrl(uri), GetStreamingFormat(source), GetPlaybackState(source), GetDRMConfiguration(source));

        successCallback({});
    }
    else
    {
        failedCallback({});
    }
}
