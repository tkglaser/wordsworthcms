﻿using com.vorwardit.wordsworthcms.Models;
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
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId)
        {
            return await Get(siteId, false);
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid siteId, bool noBody)
        {
            if (noBody)
            {
                return Ok(from c in db.Contents
                          where c.SiteId == siteId
                          select new
                          {
                              c.ContentId,
                              c.SiteId,
                              c.Url
                          });
            }
            else
            {
                return Ok(await (from s in db.Contents.Include("Site")
                                 where s.SiteId == siteId
                                 select s).ToListAsync());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Content model)
        {
            Content content;
            if (model.ContentId == -1)
            {
                content = new Content();
                db.Contents.Add(content);
            }
            else
            {
                content = await db.Contents.FindAsync(model.ContentId);
            }
            content.Body = model.Body;
            content.SiteId = model.SiteId;
            content.Url = model.Url;
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(long id)
        {
            var content = await db.Contents.FindAsync(id);
            if (content != null)
            {
                db.Contents.Remove(content);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
