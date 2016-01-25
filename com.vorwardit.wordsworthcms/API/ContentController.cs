using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/content")]
    public class ContentController : ApiController
    {
        IContentService contentService;
		IUserService userService;

		public ContentController(IContentService contentService, IUserService userService)
        {
            this.contentService = contentService;
			this.userService = userService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            var contents = await contentService.GetBySiteIdAsync(siteId);
            return Ok(from c in contents
                      select new
                      {
                          c.ContentId,
                          c.SiteId,
                          c.Url
                      });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(long id)
        {
            return Ok(await contentService.GetAsync(id));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Content model)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Designer, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			Content content = await contentService.GetOrCreateAsync(model.ContentId);
            content.Body = model.Body;
            content.SiteId = model.SiteId;
            content.Url = model.Url;
            await contentService.UpdateAsync(content);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(long id)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Designer, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			await contentService.DeleteAsync(id);
            return Ok();
        }
    }
}
