/**
 * Copyright 2015 deepsense.ai (CodiLime, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ai.deepsense.deeplang.doperations

import scala.reflect.runtime.universe.TypeTag

import ai.deepsense.commons.utils.Version
import ai.deepsense.deeplang.DOperation.Id
import ai.deepsense.deeplang.documentation.OperationDocumentation
import ai.deepsense.deeplang.doperables.SqlTransformer

class SqlTransformation extends TransformerAsOperation[SqlTransformer] with OperationDocumentation {

  override val id: Id = "6cba4400-d966-4a2a-8356-b37f37b4c73f"
  override val name: String = "SQL Transformation"
  override val description: String =
    "Executes an SQL transformation on a DataFrame"

  override lazy val tTagTO_1: TypeTag[SqlTransformer] = typeTag

  override val since: Version = Version(0, 4, 0)
}
