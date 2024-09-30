package com.dca.matrix.message;

import java.util.Collection;

public record LongIdsMessage(Long caseId, Collection<Long> ids)
{

}
