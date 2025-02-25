using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SzakDolgozat.Api.Models;
using SzakDolgozat.Api.Services;

namespace SzakDolgozat.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(
            NotificationService notificationService,
            ILogger<NotificationController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications([FromQuery] bool unreadOnly = false, [FromQuery] int limit = 0)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var notifications = await _notificationService.GetUserNotificationsAsync(userId, unreadOnly, limit);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notifications");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var count = await _notificationService.GetUnreadCountAsync(userId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unread count");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.MarkAsReadAsync(id, userId);

                if (!success)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification as read");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var count = await _notificationService.MarkAllAsReadAsync(userId);
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _notificationService.DeleteNotificationAsync(id, userId);

                if (!success)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("preferences")]
        public async Task<ActionResult<NotificationPreference>> GetPreferences()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var preferences = await _notificationService.GetOrCreateUserPreferenceAsync(userId);
                return Ok(preferences);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification preferences");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("preferences")]
        public async Task<ActionResult<NotificationPreference>> UpdatePreferences(NotificationPreference preference)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                if (preference.UserId != userId)
                {
                    preference.UserId = userId; 
                }

           
                var preferenceToSave = new NotificationPreference
                {
                    Id = preference.Id,
                    UserId = userId,
                    Enabled = preference.Enabled,
                    DaysBeforeDeadline = preference.DaysBeforeDeadline,
                    FrequencyInDays = preference.FrequencyInDays,
                    OnlyActiveProjects = preference.OnlyActiveProjects,
                    OnlyAssignedProjects = preference.OnlyAssignedProjects,
                    AlwaysNotifyOneDayBefore = preference.AlwaysNotifyOneDayBefore
                };

                var updatedPreference = await _notificationService.UpdateUserPreferenceAsync(preferenceToSave);
                return Ok(updatedPreference);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating notification preferences");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("generate-test")]
        public async Task<IActionResult> GenerateTestNotifications()
        {
            try
            {
                await _notificationService.GenerateDeadlineNotificationsAsync();
                return Ok(new { message = "Test notifications generated" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating test notifications");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}