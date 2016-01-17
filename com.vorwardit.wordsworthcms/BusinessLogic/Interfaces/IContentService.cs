using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface IContentService
    {
        Task<Content> GetAsync(long id);
        Task<Content> GetOrCreateAsync(long id);
        Task<Content> GetAsync(Guid siteId, string path);
        Task<IList<Content>> GetBySiteIdAsync(Guid siteId);

        Task UpdateAsync(Content layout);
        Task DeleteAsync(long id);
    }
}
