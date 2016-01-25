using AutoMapper;
using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Engine;
using com.vorwardit.wordsworthcms.Models;
using com.vorwardit.wordsworthcms.ViewModels;
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
    [RoutePrefix("api/layout")]
    public class PageLayoutController : ApiController
    {
        IPageLayoutService pageLayoutService;
		IUserService userService;

		public PageLayoutController(IPageLayoutService pageLayoutService, IUserService userService)
        {
            this.pageLayoutService = pageLayoutService;
			this.userService = userService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
			var pageLayouts = await pageLayoutService.GetBySiteIdAsync(siteId);
            return Ok(from l in pageLayouts
                      select new
                      {
                          l.PageLayoutId,
                          l.LayoutId,
                          l.Name
                      });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid id)
        {
			return Ok(Mapper.Map<PageLayoutViewModel>(await pageLayoutService.GetAsync(id)));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageLayoutViewModel model)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Designer, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			PageLayout pageLayout = await pageLayoutService.GetOrCreateAsync(model.PageLayoutId);
            pageLayout.LayoutId = model.LayoutId;
            pageLayout.Name = model.Name;
            pageLayout.Body = model.Body;
            await pageLayoutService.UpdateAsync(pageLayout);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
			var allowed = await userService.HasPermission(User.Identity.GetUserId(), PermissionType.Designer, null);
			if (!allowed)
			{
				return BadRequest("User is not authorised to perform this action");
			}

			await pageLayoutService.DeleteAsync(id);
            return Ok();
        }
    }
}
