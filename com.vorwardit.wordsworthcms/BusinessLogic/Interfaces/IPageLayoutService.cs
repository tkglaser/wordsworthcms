using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface IPageLayoutService
    {
        Task<PageLayout> GetAsync(Guid id);
        Task<PageLayout> GetOrCreateAsync(Guid id);
        Task<IList<PageLayout>> GetBySiteIdAsync(Guid siteId);

        Task UpdateAsync(PageLayout layout);
        Task DeleteAsync(Guid id);
    }
}
