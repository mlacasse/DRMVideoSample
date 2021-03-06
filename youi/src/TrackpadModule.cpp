#include "TrackpadModule.h"

#include <event/YiEvent.h>
#include <event/YiTrackpadEvent.h>
#include <framework/YiApp.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>
#include <youireact/ShadowTree.h>
#include <youireact/nodes/ReactComponent.h>

using namespace yi::react;

#define LOG_TAG "TrackpadModule"

YI_RN_INSTANTIATE_MODULE(TrackpadModule, EventEmitterModule);

static const std::string YI_TRACKPAD_DPAD_EVENT = "TrackpadDpad";
static const std::string YI_TRACKPAD_MOVE_EVENT = "TrackpadMove";
static const std::string YI_TRACKPAD_DOWN_EVENT = "TrackpadDown";
static const std::string YI_TRACKPAD_UP_EVENT = "TrackpadUp";

TrackpadModule::TrackpadModule()
{
    SetSupportedEvents({
        YI_TRACKPAD_DPAD_EVENT,
        YI_TRACKPAD_MOVE_EVENT,
        YI_TRACKPAD_DOWN_EVENT,
        YI_TRACKPAD_UP_EVENT
    });
}

TrackpadModule::~TrackpadModule()
{
    StopObserving();
}

#ifndef YI_TVOS
void TrackpadModule::StartObserving()
{
    auto pAppContext = CYIAppContext::GetInstance();
    if (pAppContext)
    {
        auto pApp = pAppContext->GetApp();
        if (pApp)
        {
            auto pSceneManager =pApp->GetSceneManager();
            if (pSceneManager)
            {
                pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadMove, this);
                pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadDown, this);
                pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadUp, this);
            }
        }
    }
}

void TrackpadModule::StopObserving()
{
    auto pAppContext = CYIAppContext::GetInstance();
    if (pAppContext)
    {
        auto pApp = pAppContext->GetApp();
        if (pApp)
        {
            auto pSceneManager =pApp->GetSceneManager();
            if (pSceneManager)
            {
                pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadMove, this);
                pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadDown, this);
                pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadUp, this);
            }
        }
    }
}
#endif

bool TrackpadModule::PreFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination)
{
    if (pEvent->IsTrackpadEvent())
    {
        auto trackPadEvent = static_cast<CYITrackpadEvent *>(pEvent);
        glm::vec2 translation = trackPadEvent->m_Translation;
        
        // if x > y than we're horizontal
        if (glm::abs(translation.x) > glm::abs(translation.y))
        {
            trackPadEvent->m_Translation.y = 0.f;
        }
        else
        {
            trackPadEvent->m_Translation.x = 0.f;
        }
    }
    // Return false so the engine can still handle the movement.
    return false;
}

bool TrackpadModule::PostFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination)
{
    // Return false so the engine can still handle the movement.
    return false;
}

bool TrackpadModule::HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent)
{
    YI_UNUSED(pDispatcher);
    
    SendEvent(pEvent);

    return false;
}

void TrackpadModule::SendEvent(CYIEvent *pEvent)
{
    switch(pEvent->GetType())
    {
        case CYIEvent::Type::TrackpadMove:
        {
            CYITrackpadEvent *pTrackPadEvent = dynamic_cast<CYITrackpadEvent *>(pEvent);

            EmitEvent(YI_TRACKPAD_MOVE_EVENT, folly::dynamic::object("eventType", "move")("eventName", YI_TRACKPAD_MOVE_EVENT)("translation", folly::dynamic::object("x",ToDynamic(pTrackPadEvent->m_Translation.x))("y",ToDynamic(pTrackPadEvent->m_Translation.y))));
            break;
        }
        case CYIEvent::Type::TrackpadDown:
        {
            EmitEvent(YI_TRACKPAD_DOWN_EVENT, folly::dynamic::object("eventType", "touch")("eventName", YI_TRACKPAD_DOWN_EVENT)("translation", folly::dynamic::object("x",ToDynamic(0))("y",ToDynamic(0))));
            break;
        }
        case CYIEvent::Type::TrackpadUp:
        {
            EmitEvent(YI_TRACKPAD_UP_EVENT, folly::dynamic::object("eventType", "touch")("eventName", YI_TRACKPAD_UP_EVENT)("translation", folly::dynamic::object("x",ToDynamic(0))("y",ToDynamic(0))));
            break;
        }
        default:
            break;
    }
}

void TrackpadModule::OnEmitTrackpadEvent(std::shared_ptr<CYITrackpadEvent> pEvent)
{
    SendEvent(pEvent.get());
}

void TrackpadModule::OnEmitTrackpadDpadEvent(TrackpadModule::Direction direction)
{
    EmitEvent(YI_TRACKPAD_DPAD_EVENT, folly::dynamic::object("eventType", "touch")("eventName", YI_TRACKPAD_DPAD_EVENT)("dpad", ToDynamic(getDirectionString(direction))));
}
